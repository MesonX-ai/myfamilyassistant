# Agentic AI Workflow Canvas — Low-Cost Serverless Backend
# Based on aws_infrastructure_low_cost.md (Lambda + HTTP API v2 + DynamoDB on-demand)
# NOTE: Upstash Redis REST credentials are optional; add them in terraform.tfvars
#       to wire the cache layer later. All resources are in us-east-2 (project Region).

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.4"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project   = "MyFamilyAssistant-Agentic-Canvas"
      ManagedBy = "Terraform"
      CostTier  = "low-cost"
    }
  }
}

# ------------------------------------------------------------------------------
# Variables
# ------------------------------------------------------------------------------
variable "aws_region" {
  type    = string
  default = "us-east-2"
}

variable "app_name" {
  type    = string
  default = "myfamilyassistant-canvas"
}

variable "upstash_redis_rest_url" {
  type        = string
  default     = ""
  sensitive   = true
  description = "Upstash Redis REST URL (optional; leave empty to skip cache wiring)"
}

variable "upstash_redis_rest_token" {
  type        = string
  default     = ""
  sensitive   = true
  description = "Upstash Redis REST Token (optional; leave empty to skip cache wiring)"
}

# ------------------------------------------------------------------------------
# DynamoDB Table (On-Demand Billing — no fixed capacity cost)
# ------------------------------------------------------------------------------
resource "aws_dynamodb_table" "app_db" {
  name         = "${var.app_name}-db"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "PK"
  range_key    = "SK"

  attribute {
    name = "PK"
    type = "S"
  }

  attribute {
    name = "SK"
    type = "S"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  tags = {
    Environment = "Production"
    Project     = var.app_name
  }
}

# ------------------------------------------------------------------------------
# IAM Role & Policies for Lambda
# ------------------------------------------------------------------------------
resource "aws_iam_role" "lambda_exec" {
  name = "${var.app_name}-lambda-exec-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_policy" "dynamodb_access" {
  name = "${var.app_name}-dynamodb-access"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ]
      Resource = [
        aws_dynamodb_table.app_db.arn,
        "${aws_dynamodb_table.app_db.arn}/*"
      ]
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_dynamodb_attach" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.dynamodb_access.arn
}


# ------------------------------------------------------------------------------
# Lambda Function Code Archive (FastAPI + LangGraph via Mangum)
# IMPORTANT: run backend/build_lambda.sh first — it populates ./build with the
# Python dependencies (aarch64 wheels), the app package, and the handler.
# ------------------------------------------------------------------------------
data "archive_file" "lambda_package" {
  type        = "zip"
  source_dir  = "${path.module}/build"
  output_path = "${path.module}/lambda.zip"
}

# ------------------------------------------------------------------------------
# AWS Lambda Function
# ------------------------------------------------------------------------------
resource "aws_lambda_function" "api_worker" {
  filename         = data.archive_file.lambda_package.output_path
  function_name    = "${var.app_name}-api-worker"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "lambda_handler.handler"
  source_code_hash = data.archive_file.lambda_package.output_base64sha256
  runtime          = "python3.12"
  architectures    = ["arm64"]
  memory_size      = 512
  timeout          = 30

  environment {
    variables = {
      DYNAMODB_TABLE           = aws_dynamodb_table.app_db.name
      UPSTASH_REDIS_REST_URL   = var.upstash_redis_rest_url
      UPSTASH_REDIS_REST_TOKEN = var.upstash_redis_rest_token
    }
  }
}

# ------------------------------------------------------------------------------
# HTTP API Gateway (v2)
# ------------------------------------------------------------------------------
resource "aws_apigatewayv2_api" "http_api" {
  name          = "${var.app_name}-http-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allow_headers = ["*"]
  }
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.api_worker.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "proxy_route" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

# Cover the root path ("/") as well — the proxy+ route only matches sub-paths
resource "aws_apigatewayv2_route" "root_route" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "ANY /"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

# Grant API Gateway permission to invoke Lambda
resource "aws_lambda_permission" "api_gw_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api_worker.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

# ------------------------------------------------------------------------------
# Outputs
# ------------------------------------------------------------------------------
output "api_endpoint" {
  value       = aws_apigatewayv2_api.http_api.api_endpoint
  description = "The HTTP endpoint of the API Gateway"
}

output "dynamodb_table_name" {
  value       = aws_dynamodb_table.app_db.name
  description = "DynamoDB table for canvas graph state"
}

output "lambda_function_name" {
  value       = aws_lambda_function.api_worker.function_name
  description = "Lambda backing the API"
}
