"""
Upstash Redis REST cache helpers for the canvas backend.

Uses the HTTP/REST-based Redis client so the Lambda needs no VPC,
security groups, or NAT gateway. Degrades gracefully to a no-op when
the UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN environment
variables are absent (e.g., local unit tests), so caching is always
optional and can never break pipeline execution.
"""
import hashlib
import json
import logging
import os
from typing import Any, Dict, Optional

logger = logging.getLogger(__name__)

CACHE_TTL_SECONDS = 3600  # 1 hour

_client: Optional[Any] = None


def _get_client():
    """Lazily build the async Upstash REST client; None when unconfigured."""
    global _client
    if _client is not None:
        return _client
    url = os.environ.get("UPSTASH_REDIS_REST_URL")
    token = os.environ.get("UPSTASH_REDIS_REST_TOKEN")
    if not url or not token:
        return None
    try:
        from upstash_redis.asyncio import Redis
    except ImportError:
        logger.warning("upstash-redis package not installed; cache disabled")
        return None
    _client = Redis(url=url, token=token)
    return _client


def build_cache_key(payload: Any, initial_query: str) -> str:
    """Deterministic cache key from the canvas payload + initial query."""
    digest = hashlib.sha256(
        json.dumps({"payload": payload, "q": initial_query}, sort_keys=True, default=str).encode()
    ).hexdigest()
    return f"canvas:result:{digest}"


async def get_cached(key: str) -> Optional[Dict[str, Any]]:
    """Return the cached execution result, or None on miss/unconfigured/error."""
    client = _get_client()
    if client is None:
        return None
    try:
        raw = await client.get(key)
        if raw:
            data = json.loads(raw)
            data.setdefault("telemetry", {})["cache_hit"] = True
            return data
    except Exception as exc:  # noqa: BLE001 — cache must never break the pipeline
        logger.warning("Redis GET failed (continuing without cache): %s", exc)
    return None


async def set_cached(key: str, value: Dict[str, Any], ttl: int = CACHE_TTL_SECONDS) -> None:
    """Store the execution result with a TTL; failures are logged, never raised."""
    client = _get_client()
    if client is None:
        return
    try:
        await client.set(key, json.dumps(value), ex=ttl)
    except Exception as exc:  # noqa: BLE001
        logger.warning("Redis SET failed (continuing without cache): %s", exc)
