from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_execute_canvas_success():
    payload = {
        "workspace_id": "ws-prod-7781",
        "nodes": [
            {"id": "node_1", "type": "trigger", "data": {"label": "Start Hook"}},
            {"id": "node_2", "type": "llm_agent", "data": {"label": "Claude Analyzer"}},
            {"id": "node_3", "type": "output", "data": {"label": "Consolidate Result"}},
        ],
        "edges": [
            {"id": "wire_1", "source": "node_1", "target": "node_2"},
            {"id": "wire_2", "source": "node_2", "target": "node_3"},
        ],
    }
    resp = client.post(
        "/api/v1/pipeline/execute-canvas",
        json=payload,
        params={"initial_query": "Execute Market Analysis"},
    )
    assert resp.status_code == 200, resp.text
    data = resp.json()
    assert data["status"] == "success"
    assert data["result"].startswith("Pipeline Completed Successfully")
    assert data["telemetry"]["trigger_processed"] is True
    assert data["telemetry"]["llm_completed"] is True
    assert data["telemetry"]["pipeline_completed"] is True
    assert "Parsed via Bedrock Claude 3.5" in data["result"]


def test_missing_trigger_node():
    payload = {
        "workspace_id": "ws-x",
        "nodes": [{"id": "n1", "type": "llm_agent", "data": {}}],
        "edges": [],
    }
    resp = client.post(
        "/api/v1/pipeline/execute-canvas", json=payload, params={"initial_query": "x"}
    )
    assert resp.status_code == 400


def test_unknown_node_type():
    payload = {
        "workspace_id": "ws-x",
        "nodes": [
            {"id": "t", "type": "trigger", "data": {}},
            {"id": "u", "type": "weird", "data": {}},
        ],
        "edges": [{"id": "e", "source": "t", "target": "u"}],
    }
    resp = client.post(
        "/api/v1/pipeline/execute-canvas", json=payload, params={"initial_query": "x"}
    )
    assert resp.status_code == 400


def test_dangling_edge():
    payload = {
        "workspace_id": "ws-x",
        "nodes": [{"id": "t", "type": "trigger", "data": {}}],
        "edges": [{"id": "e", "source": "t", "target": "missing"}],
    }
    resp = client.post(
        "/api/v1/pipeline/execute-canvas", json=payload, params={"initial_query": "x"}
    )
    assert resp.status_code == 400
