from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from .compiler import ReactFlowCanvasPayload, build_executable_graph

app = FastAPI(
    title="AI Agent Canvas Compiler Core",
    version="1.0.0",
    description="Engine for compiling visual node-wire layouts into reactive LangGraph state machines.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post(
    "/api/v1/pipeline/execute-canvas",
    status_code=status.HTTP_200_OK,
    summary="Execute Visual Workflow Canvas Payload",
)
async def execute_canvas_workflow(payload: ReactFlowCanvasPayload, initial_query: str = ""):
    try:
        runtime_engine = build_executable_graph(payload)

        initial_state = {
            "input_payload": initial_query,
            "processed_elements": [],
            "execution_telemetry": {"workspace_id": payload.workspace_id},
            "final_response": "",
        }

        execution_summary = await runtime_engine.ainvoke(initial_state)

        return {
            "status": "success",
            "workspace_id": payload.workspace_id,
            "result": execution_summary.get("final_response"),
            "telemetry": execution_summary.get("execution_telemetry"),
        }
    except ValueError as format_error:
        raise HTTPException(status_code=400, detail=str(format_error))
    except Exception as runtime_fault:
        raise HTTPException(status_code=500, detail=f"Graph Execution Runtime Fault: {str(runtime_fault)}")
