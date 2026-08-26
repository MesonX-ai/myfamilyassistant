variable "name_prefix" {
  type = string
}

variable "aws_region" {
  type = string
}

variable "api_target_url" {
  type    = string
  default = ""
}

variable "cognito_callback_urls" {
  type    = list(string)
  default = []
}
