terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket         = "agentic-platform-tfstate-prod"
    key            = "platform/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "agentic-platform-tflocks"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "Agentic-Workflow-Platform"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

locals {
  name_prefix = "agentic-${var.environment}"
}

module "vpc" {
  source      = "./modules/vpc"
  name_prefix = local.name_prefix
  vpc_cidr    = var.vpc_cidr
  aws_region  = var.aws_region
}

module "security" {
  source      = "./modules/security"
  name_prefix = local.name_prefix
  vpc_id      = module.vpc.vpc_id
}

module "storage" {
  source                  = "./modules/storage"
  name_prefix             = local.name_prefix
  db_password             = var.db_password
  data_subnet_ids         = module.vpc.private_data_subnet_ids
  db_security_group_id    = module.security.db_security_group_id
  redis_security_group_id = module.security.redis_security_group_id
}

module "messaging" {
  source                = "./modules/messaging"
  name_prefix           = local.name_prefix
  aws_region            = var.aws_region
  api_target_url        = var.api_target_url
  cognito_callback_urls = var.cognito_callback_urls
}

module "ecs" {
  source                   = "./modules/ecs"
  name_prefix              = local.name_prefix
  aws_region               = var.aws_region
  app_subnet_ids           = module.vpc.private_app_subnet_ids
  worker_security_group_id = module.security.worker_security_group_id
  ecr_repository_url       = var.ecr_repository_url
  sqs_queue_url            = module.storage.sqs_queue_url
  redis_endpoint           = module.storage.redis_endpoint
}
