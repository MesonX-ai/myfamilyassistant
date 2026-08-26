"use client";

import { useEffect } from "react";
import { Background, Controls, MiniMap, ReactFlow, ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
import { useCanvasStore } from "@/lib/store";
import { AgentNode } from "./nodes";

const nodeTypes = {
  trigger: AgentNode,
  llm_agent: AgentNode,
  output: AgentNode,
};

const buttonStyle: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 8,
  border: "1px solid #334155",
  background: "#1e293b",
  color: "#e2e8f0",
  fontSize: 13,
};

function CanvasInner() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    query,
    setQuery,
    run,
    result,
    telemetry,
    status,
    error,
    clear,
    reset,
    save,
  } = useCanvasStore();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("myfa-canvas-state");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.nodes?.length || parsed.edges?.length) {
        useCanvasStore.setState({
          nodes: parsed.nodes,
          edges: parsed.edges,
          query: parsed.query ?? "",
        });
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 16px",
          background: "#0f172a",
          color: "white",
          flexWrap: "wrap",
        }}
      >
        <strong style={{ fontSize: 16 }}>Agentic Workflow Platform</strong>
        <div style={{ display: "flex", gap: 8, marginLeft: 8, flexWrap: "wrap" }}>
          <button style={buttonStyle} onClick={() => addNode("trigger")}>
            + Trigger
          </button>
          <button style={buttonStyle} onClick={() => addNode("llm_agent")}>
            + LLM Agent
          </button>
          <button style={buttonStyle} onClick={() => addNode("output")}>
            + Output
          </button>
        </div>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Initial query..."
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              border: "1px solid #334155",
              background: "#1e293b",
              color: "white",
            }}
          />
          <button
            onClick={run}
            disabled={status === "running"}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              background: "#22c55e",
              color: "#04210f",
              fontWeight: 700,
              border: "none",
            }}
          >
            {status === "running" ? "Running…" : "Run Pipeline"}
          </button>
          <button style={{ ...buttonStyle, background: "#334155" }} onClick={clear}>
            Clear
          </button>
          <button style={{ ...buttonStyle, background: "#1e3a5f" }} onClick={reset}>
            Reset
          </button>
          <button
            onClick={save}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              background: "#7c3aed",
              color: "white",
              fontWeight: 700,
              border: "none",
            }}
          >
            Save
          </button>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>

        <aside
          style={{
            width: 340,
            borderLeft: "1px solid #e2e8f0",
            padding: 16,
            overflow: "auto",
            background: "#f8fafc",
            color: "#0f172a",
          }}
        >
          <h3 style={{ margin: "0 0 8px" }}>Result</h3>
          {status === "error" && <p style={{ color: "#dc2626" }}>{error}</p>}
          {result && (
            <pre style={{ whiteSpace: "pre-wrap", fontSize: 13, margin: 0 }}>{result}</pre>
          )}
          {telemetry && (
            <div style={{ marginTop: 16 }}>
              <h4 style={{ margin: "0 0 8px" }}>Telemetry</h4>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13 }}>
                {Object.entries(telemetry).map(([k, v]) => (
                  <li key={k}>
                    <code>{k}</code>: {String(v)}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!result && !error && status === "idle" && (
            <p style={{ color: "#64748b", fontSize: 13 }}>
              Add a Trigger, an LLM Agent, and an Output node, connect them, then run the
              pipeline.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}

export default function Canvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
