output "vpc_id" {
  value = module.vpc.vpc_id
}

output "aurora_endpoint" {
  value     = module.storage.aurora_endpoint
  sensitive = true
}

output "redis_endpoint" {
  value = module.storage.redis_endpoint
}

output "sqs_queue_url" {
  value = module.storage.sqs_queue_url
}

output "api_gateway_url" {
  value = module.messaging.api_gateway_url
}

output "cognito_user_pool_id" {
  value = module.messaging.cognito_user_pool_id
}

output "ecs_cluster_name" {
  value = module.ecs.cluster_name
}
