# AWS Full Serverless Infrastructure Setup Guide (Terraform)

This guide details how to deploy a serverless architecture using AWS Lambda, HTTP API Gateway v2, DynamoDB (On-Demand), and Upstash Redis.

---

## 1. Prerequisites

Before running the deployment, make sure you have:

1. **AWS CLI** installed and configured (`aws configure`).
2. **Terraform CLI** (v1.5+) installed.
3. An **Upstash Account** (Free Tier) to obtain your Redis REST URL and Token.

---

## 2. Infrastructure Architecture Overview

* **API Gateway:** HTTP API v2 (lowest latency, ~$1.00/1M requests, zero fixed monthly cost).
* **Compute:** AWS Lambda running Node.js / Python / Go (Free Tier eligible: 1M calls + 400k GB-sec/mo).
* **Database:** Amazon DynamoDB with `PAY_PER_REQUEST` billing (no fixed capacity units).
* **Cache:** Upstash Serverless Redis (connected over HTTP/REST, eliminating the need for a VPC or NAT Gateway).
* **Networking:** Default VPC / Public execution (0 NAT Gateway costs).

---

## 3. Deployment Code (`main.tf`)

Save the following content as `main.tf`:

```hcl
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
}

# ------------------------------------------------------------------------------
# Variables
# ------------------------------------------------------------------------------
variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "app_name" {
  type    = string
  default = "serverless-app"
}

variable "upstash_redis_rest_url" {
  type      = string
  sensitive = true
  description = "Upstash Redis REST URL"
}

variable "upstash_redis_rest_token" {
  type      = string
  sensitive = true
  description = "Upstash Redis REST Token"
}

# ------------------------------------------------------------------------------
# DynamoDB Table (On-Demand Billing)
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
  name        = "${var.app_name}-dynamodb-access"
  description = "Allow Lambda to interact with DynamoDB"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ]
      Resource = [
        aws_dynamodb_table.app_db.arn,
        "${aws_dynamodb_table.app_db.arn}/index/*"
      ]
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_dynamodb_attach" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.dynamodb_access.arn
}

# ------------------------------------------------------------------------------
# Lambda Function Code Archive (Dummy Payload)
# ------------------------------------------------------------------------------
data "archive_file" "lambda_dummy" {
  type        = "zip"
  output_path = "${path.module}/lambda.zip"

  source {
    content  = <<EOF exports.handler="async"> {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Hello from Serverless API", path: event.rawPath })
  };
};
EOF
    filename = "index.js"
  }
}

# ------------------------------------------------------------------------------
# AWS Lambda Function
# ------------------------------------------------------------------------------
resource "aws_lambda_function" "api_worker" {
  filename         = data.archive_file.lambda_dummy.output_path
  function_name    = "${var.app_name}-api-worker"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "index.handler"
  source_code_hash = data.archive_file.lambda_dummy.output_base64sha256
  runtime          = "nodejs20.x"
  memory_size      = 512
  timeout          = 10

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
  api_id           = aws_apigatewayv2_api.http_api.id
  integration_type = "AWS_PROXY"

  integration_uri    = aws_lambda_function.api_worker.invoke_arn
  integration_method = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "default_route" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "ANY /{proxy+}"
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