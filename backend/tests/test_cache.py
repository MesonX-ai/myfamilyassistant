"""Tests for the Upstash Redis cache helpers (graceful no-op behavior)."""
import asyncio

import pytest

from app.cache import build_cache_key, get_cached, set_cached


def test_cache_key_is_deterministic():
    payload = {"workspace_id": "ws-1", "nodes": [], "edges": []}
    assert build_cache_key(payload, "hello") == build_cache_key(payload, "hello")


def test_cache_key_changes_with_inputs():
    payload_a = {"workspace_id": "ws-1", "nodes": [], "edges": []}
    payload_b = {"workspace_id": "ws-2", "nodes": [], "edges": []}
    assert build_cache_key(payload_a, "q") != build_cache_key(payload_b, "q")
    assert build_cache_key(payload_a, "q1") != build_cache_key(payload_a, "q2")


def test_cache_noops_without_env(monkeypatch):
    """Without Upstash env vars the cache must no-op, never raise."""
    monkeypatch.delenv("UPSTASH_REDIS_REST_URL", raising=False)
    monkeypatch.delenv("UPSTASH_REDIS_REST_TOKEN", raising=False)
    import app.cache as cache_mod

    cache_mod._client = None  # reset lazy singleton

    async def run():
        assert await get_cached("canvas:test") is None
        await set_cached("canvas:test", {"ok": True})  # must not raise

    asyncio.run(run())

