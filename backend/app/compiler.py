from typing import Dict, Any, List, Optional

from typing_extensions import TypedDict
from pydantic import BaseModel, Field
from langgraph.graph import StateGraph, START


class WorkflowExecutionState(TypedDict):
    input_payload: str
    processed_elements: List[str]
    execution_telemetry: Dict[str, Any]
    final_response: str


class CanvasEdgeDefinition(BaseModel):
    id: str
    source: str
    target: str


class CanvasNodeData(BaseModel):
    label: Optional[str] = "Node Component"
    config: Optional[Dict[str, Any]] = Field(default_factory=dict)


class CanvasNodeDefinition(BaseModel):
    id: str
    type: str
    data: CanvasNodeData = Field(default_factory=CanvasNodeData)


class ReactFlowCanvasPayload(BaseModel):
    workspace_id: str
    nodes: List[CanvasNodeDefinition]
    edges: List[CanvasEdgeDefinition]


async def run_trigger_processing(state: WorkflowExecutionState) -> Dict[str, Any]:
    payload = state.get("input_payload", "").strip()
    telemetry = state.get("execution_telemetry", {})
    telemetry["trigger_processed"] = True
    return {"input_payload": payload, "execution_telemetry": telemetry}


async def run_llm_inference(state: WorkflowExecutionState) -> Dict[str, Any]:
    raw_text = state.get("input_payload", "")
    processed = state.get("processed_elements", [])
    telemetry = state.get("execution_telemetry", {})
    inference_result = f"Parsed via Bedrock Claude 3.5: '{raw_text[:100]}'"
    processed.append(inference_result)
    telemetry["llm_completed"] = True
    return {"processed_elements": processed, "execution_telemetry": telemetry}


async def run_output_generation(state: WorkflowExecutionState) -> Dict[str, Any]:
    processed = state.get("processed_elements", [])
    telemetry = state.get("execution_telemetry", {})
    telemetry["pipeline_completed"] = True
    summary = f"Pipeline Completed Successfully. Captured Nodes Output: {'; '.join(processed)}"
    return {"final_response": summary, "execution_telemetry": telemetry}


NODE_WORKER_REGISTRY = {
    "trigger": run_trigger_processing,
    "llm_agent": run_llm_inference,
    "output": run_output_generation,
}


def build_executable_graph(canvas_data: ReactFlowCanvasPayload):
    workflow_builder = StateGraph(WorkflowExecutionState)
    active_node_ids = set()

    for block in canvas_data.nodes:
        execution_handler = NODE_WORKER_REGISTRY.get(block.type)
        if not execution_handler:
            raise ValueError(
                f"Unmapped visual component variant detected: '{block.type}' on node '{block.id}'"
            )
        workflow_builder.add_node(block.id, execution_handler)
        active_node_ids.add(block.id)

    for connection in canvas_data.edges:
        if connection.source not in active_node_ids or connection.target not in active_node_ids:
            raise ValueError(f"Dangling flow wire error: {connection.source} -> {connection.target}")
        workflow_builder.add_edge(connection.source, connection.target)

    root_triggers = [n for n in canvas_data.nodes if n.type == "trigger"]
    if not root_triggers:
        raise ValueError("Invalid Topology Layout: Canvas must include at least one root 'trigger' node.")

    workflow_builder.add_edge(START, root_triggers[0].id)
    return workflow_builder.compile()
