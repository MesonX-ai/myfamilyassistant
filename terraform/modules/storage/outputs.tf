output "aurora_endpoint" {
  value     = aws_rds_cluster.aurora.endpoint
  sensitive = true
}

output "sqs_queue_url" {
  value = aws_sqs_queue.workflow_fifo.url
}

output "redis_endpoint" {
  value = aws_elasticache_serverless_cache.redis.endpoint[0].address
}
