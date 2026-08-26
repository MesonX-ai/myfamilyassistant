aws_region            = "us-east-1"
environment           = "dev"
vpc_cidr              = "10.0.0.0/16"
db_password           = "CHANGE_ME"
ecr_repository_url    = "123456789012.dkr.ecr.us-east-1.amazonaws.com/agentic-worker:latest"
api_target_url        = "https://internal-alb-xxxx.us-east-1.elb.amazonaws.com"
cognito_callback_urls = ["https://localhost:3000"]
