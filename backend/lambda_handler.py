"""
AWS Lambda entry point for the Agentic AI Workflow Canvas backend.

Wraps the FastAPI application with Mangum so API Gateway HTTP API v2
(payload format 2.0) requests are translated into ASGI calls.
"""
from mangum import Mangum

from app.main import app

handler = Mangum(app, api_gateway_base_path="/")
