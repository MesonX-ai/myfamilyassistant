variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "environment" {
  type    = string
  default = "dev"
}

variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "ecr_repository_url" {
  type        = string
  description = "ECR repository URL hosting the LangGraph worker image"
}

variable "api_target_url" {
  type        = string
  default     = ""
  description = "Internal ALB URL of the FastAPI orchestrator (API Gateway HTTP_PROXY target)"
}

variable "cognito_callback_urls" {
  type    = list(string)
  default = []
}
