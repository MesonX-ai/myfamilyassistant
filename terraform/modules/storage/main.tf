resource "aws_db_subnet_group" "aurora" {
  name       = "${var.name_prefix}-aurora-subnet-group"
  subnet_ids = var.data_subnet_ids
}

resource "aws_rds_cluster" "aurora" {
  cluster_identifier     = "${var.name_prefix}-aurora-postgres"
  engine                 = "aurora-postgresql"
  engine_mode            = "provisioned"
  engine_version         = "15.4"
  database_name          = "agentic_platform"
  master_username        = "db_admin_user"
  master_password        = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.aurora.name
  vpc_security_group_ids = [var.db_security_group_id]
  skip_final_snapshot    = true
  storage_encrypted      = true

  serverlessv2_scaling_configuration {
    min_capacity = 0.5
    max_capacity = 16.0
  }
}

resource "aws_rds_cluster_instance" "aurora_instances" {
  count              = 2
  identifier         = "${var.name_prefix}-aurora-node-${count.index + 1}"
  cluster_identifier = aws_rds_cluster.aurora.id
  instance_class     = "db.serverless"
  engine             = aws_rds_cluster.aurora.engine
  engine_version     = aws_rds_cluster.aurora.engine_version
}

resource "aws_sqs_queue" "workflow_fifo" {
  name                        = "${var.name_prefix}-execution-queue.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  visibility_timeout_seconds  = 300
  message_retention_seconds   = 86400

  kms_master_key_id = "alias/aws/sqs"
}

resource "aws_elasticache_serverless_cache" "redis" {
  name                 = "${var.name_prefix}-redis-pubsub"
  engine               = "redis"
  major_engine_version = "7"

  cache_usage_limits {
    data_storage {
      maximum = 10
      unit    = "GB"
    }
  }

  subnet_ids         = var.data_subnet_ids
  security_group_ids = [var.redis_security_group_id]
}
