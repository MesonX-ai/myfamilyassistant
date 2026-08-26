variable "name_prefix" {
  type = string
}

variable "aws_region" {
  type = string
}

variable "app_subnet_ids" {
  type = list(string)
}

variable "worker_security_group_id" {
  type = string
}

variable "ecr_repository_url" {
  type = string
}

variable "sqs_queue_url" {
  type = string
}

variable "redis_endpoint" {
  type = string
}
