"use client";

import { useEffect } from "react";
import { Background, Controls, MiniMap, ReactFlow, ReactFlowProvider, useReactFlow, type Node } from "reactflow";
import "reactflow/dist/style.css";
import { Icon } from "@iconify/react";
import { useCanvasStore, type AgentNodeType, type AgentNodeData } from "@/lib/store";
import { AgentNode } from "./nodes";

const AGENT_NODE_TYPES: AgentNodeType[] = [
  "trigger",
  "llm_agent",
  "output",
  "agent",
  "context",
  "memory",
  "task_decomposition",
  "prompt_template",
  "multi_agent_router",
  "tool",
  "mcp",
  "semantic_branch",
  "reflection_loop",
  "human_in_the_loop",
  "guardrail",
];

const nodeTypes = Object.fromEntries(AGENT_NODE_TYPES.map((t) => [t, AgentNode]));

interface PaletteItem {
  type: AgentNodeType;
  label: string;
  icon: string;
  /** Accent color, matching the homepage builder's type colors */
  accent: string;
}

const PALETTE_GROUPS: { group: string; items: PaletteItem[] }[] = [
  {
    group: "Connectors",
    items: [
      { type: "trigger", label: "Gmail", icon: "logos:google-gmail", accent: "#38bdf8" },
      { type: "trigger", label: "Google Drive", icon: "logos:google-drive", accent: "#38bdf8" },
      { type: "trigger", label: "Cloud Drive", icon: "lucide:cloud", accent: "#38bdf8" },
      { type: "trigger", label: "Calendar", icon: "logos:google-calendar", accent: "#38bdf8" },
      { type: "trigger", label: "WhatsApp", icon: "logos:whatsapp-icon", accent: "#38bdf8" },
      { type: "trigger", label: "LinkedIn", icon: "logos:linkedin-icon", accent: "#38bdf8" },
      { type: "trigger", label: "Instagram", icon: "skill-icons:instagram", accent: "#38bdf8" },
    ],
  },
  {
    group: "Triggers",
    items: [
      { type: "trigger", label: "Webhook", icon: "lucide:plug-zap", accent: "#22d3ee" },
      { type: "trigger", label: "Schedule", icon: "lucide:clock", accent: "#22d3ee" },
    ],
  },
  {
    group: "Agents",
    items: [
      { type: "llm_agent", label: "Assistant Bot", icon: "lucide:bot", accent: "#a855f7" },
    ],
  },
  {
    group: "Outputs",
    items: [
      { type: "output", label: "Send Email/Text", icon: "lucide:mail", accent: "#34d399" },
      { type: "output", label: "Slack Alert", icon: "lucide:bell", accent: "#fbbf24" },
      { type: "output", label: "Database", icon: "lucide:database", accent: "#38bdf8" },
    ],
  },
  {
    group: "Intelligence",
    items: [
      { type: "agent", label: "AI Agent", icon: "lucide:bot", accent: "#a855f7" },
      { type: "context", label: "Context Grounding", icon: "lucide:database", accent: "#818cf8" },
      { type: "memory", label: "Working Memory", icon: "lucide:brain", accent: "#818cf8" },
    ],
  },
  {
    group: "Orchestration",
    items: [
      { type: "task_decomposition", label: "Task Decomposition", icon: "lucide:layers", accent: "#f472b6" },
      { type: "prompt_template", label: "Prompt Template", icon: "lucide:terminal", accent: "#f472b6" },
      { type: "multi_agent_router", label: "Multi-Agent Router", icon: "lucide:git-fork", accent: "#f472b6" },
    ],
  },
  {
    group: "Integration",
    items: [
      { type: "tool", label: "Function Caller", icon: "lucide:wrench", accent: "#38bdf8" },
      { type: "mcp", label: "MCP Adapter", icon: "lucide:cpu", accent: "#38bdf8" },
    ],
  },
  {
    group: "Control Flow",
    items: [
      { type: "semantic_branch", label: "Semantic Branch", icon: "lucide:split", accent: "#fbbf24" },
      { type: "reflection_loop", label: "Reflection Loop", icon: "lucide:refresh-cw", accent: "#fbbf24" },
    ],
  },
  {
    group: "Governance",
    items: [
      { type: "human_in_the_loop", label: "Human Verification", icon: "lucide:user-check", accent: "#f87171" },
      { type: "guardrail", label: "Safety Guardrail", icon: "lucide:shield-alert", accent: "#f87171" },
    ],
  },
];

const buttonStyle: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 8,
  border: "1px solid #334155",
  background: "#1e293b",
  color: "#e2e8f0",
  fontSize: 13,
};

/* Inspector panel styles (spec §3 — node configuration editing) */
const inspectorLabel: React.CSSProperties = {
  display: "block",
  margin: "10px 0 4px",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: 1,
  textTransform: "uppercase",
  color: "#64748b",
};
const inspectorInput: React.CSSProperties = {
  width: "100%",
  padding: "6px 8px",
  borderRadius: 8,
  border: "1px solid #334155",
  background: "#1e293b",
  color: "#e2e8f0",
  fontSize: 12,
  outline: "none",
};

function ConfigEditor({
  node,
  update,
}: {
  node: Node<AgentNodeData>;
  update: (key: string, value: unknown) => void;
}) {
  const cfg = (node.data?.config ?? {}) as Record<string, unknown>;
  switch (node.type) {
    case "llm_agent":
    case "agent":
      return (
        <div>
          <label style={inspectorLabel}>Model Family</label>
          <select
            value={(cfg.model as string) ?? "gpt-4o"}
            onChange={(e) => update("model", e.target.value)}
            style={inspectorInput}
          >
            <option value="gpt-4o">gpt-4o</option>
            <option value="claude-3-5-sonnet">claude-3-5-sonnet</option>
            <option value="o1-pro">o1-pro</option>
          </select>
          <label style={inspectorLabel}>Temperature — {String(cfg.temperature ?? 0.7)}</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={(cfg.temperature as number) ?? 0.7}
            onChange={(e) => update("temperature", parseFloat(e.target.value))}
            style={{ width: "100%", accentColor: "#6366f1" }}
          />
        </div>
      );
    case "reflection_loop":
      return (
        <div>
          <label style={inspectorLabel}>Max Iterations</label>
          <input
            type="number"
            min={1}
            max={10}
            value={(cfg.maxRetries as number) ?? 3}
            onChange={(e) => update("maxRetries", Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
            style={inspectorInput}
          />
        </div>
      );
    case "prompt_template":
      return (
        <div>
          <label style={inspectorLabel}>Template</label>
          <textarea
            rows={4}
            value={(cfg.template as string) ?? "Summarize {{input}} for the family."}
            onChange={(e) => update("template", e.target.value)}
            style={{ ...inspectorInput, resize: "vertical" }}
          />
        </div>
      );
    case "semantic_branch":
      return (
        <div>
          <label style={inspectorLabel}>Branch Labels (comma-separated)</label>
          <input
            value={(cfg.branches as string) ?? "urgent, routine"}
            onChange={(e) => update("branches", e.target.value)}
            style={inspectorInput}
          />
        </div>
      );
    case "human_in_the_loop":
      return (
        <div>
          <label style={inspectorLabel}>Approver</label>
          <input
            value={(cfg.approver as string) ?? "parent@myfamilyassistant.ai"}
            onChange={(e) => update("approver", e.target.value)}
            style={inspectorInput}
          />
        </div>
      );
    case "guardrail":
      return (
        <div>
          <label style={inspectorLabel}>Compliance Rules</label>
          <input
            value={(cfg.rules as string) ?? "PII redaction, toxicity filter"}
            onChange={(e) => update("rules", e.target.value)}
            style={inspectorInput}
          />
        </div>
      );
    default:
      return (
        <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
          No configurable options for this node type.
        </p>
      );
  }
}

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
    selectedNodeId,
    setSelectedNodeId,
    updateNodeConfig,
    deleteNode,
    simulate,
  } = useCanvasStore();
  const { screenToFlowPosition } = useReactFlow();
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData("application/myfa-node");
    if (!raw) return;
    try {
      const item = JSON.parse(raw) as { type: AgentNodeType; label: string; icon?: string };
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      addNode(item.type, { label: item.label, icon: item.icon, position });
    } catch {
      // malformed payload — ignore
    }
  };

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
            onClick={simulate}
            disabled={status === "running"}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              background: "#6366f1",
              color: "white",
              fontWeight: 700,
              border: "none",
            }}
          >
            Simulate
          </button>
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

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 16px",
          background: "#0b1120",
          borderBottom: "1px solid #1e293b",
          color: "#94a3b8",
          fontSize: 13,
          flexWrap: "wrap",
        }}
      >
        <Icon icon="lucide:spline" width={16} style={{ color: "#34d399", flexShrink: 0 }} />
        <span>
          <strong style={{ color: "#e2e8f0" }}>To link nodes:</strong> drag from the dot at the
          bottom edge of a source node and drop it on the dot at the top edge of a target node.
        </span>
      </div>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <aside
          style={{
            width: 230,
            flexShrink: 0,
            borderRight: "1px solid #1e293b",
            padding: 16,
            overflowY: "auto",
            background: "#0f172a",
            color: "#e2e8f0",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#818cf8",
              marginBottom: 10,
            }}
          >
            ◆ Palette
          </div>
          <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 14px" }}>
            Drag onto the canvas — or click to add.
          </p>
          {PALETTE_GROUPS.map(({ group, items }) => (
            <div key={group} style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  margin: "0 0 8px",
                }}
              >
                {group}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {items.map((item) => (
                  <div
                    key={item.label}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData(
                        "application/myfa-node",
                        JSON.stringify({ type: item.type, label: item.label, icon: item.icon }),
                      );
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onClick={() => addNode(item.type, { label: item.label, icon: item.icon })}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 10px",
                      borderRadius: 10,
                      border: `1px solid ${item.accent}55`,
                      background: `${item.accent}1f`,
                      color: "#e2e8f0",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "grab",
                      userSelect: "none",
                    }}
                    title={`Add ${item.label} node`}
                  >
                    <Icon icon={item.icon} width={18} height={18} style={{ color: item.accent }} />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </aside>

        <div
          style={{ flex: 1, minHeight: 0, background: "#0b1120" }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_, node) => setSelectedNodeId(node.id)}
            onPaneClick={() => setSelectedNodeId(null)}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={{
              animated: true,
              style: { stroke: "#818cf8", strokeWidth: 2, strokeDasharray: "6 4" },
            }}
            connectionLineStyle={{ stroke: "#818cf8", strokeWidth: 2 }}
            fitView
          >
            <Background gap={22} color="#cbd5e1" style={{ opacity: 0.35 }} />
            <Controls />
            <MiniMap
              pannable
              zoomable
              style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8 }}
              maskColor="rgba(2, 6, 23, 0.7)"
              nodeColor={() => "#38bdf8"}
              nodeStrokeColor={() => "#0ea5e9"}
            />
          </ReactFlow>
        </div>

        <aside
          style={{
            width: 340,
            flexShrink: 0,
            borderLeft: "1px solid #1e293b",
            padding: 16,
            overflow: "auto",
            background: "#0f172a",
            color: "#e2e8f0",
          }}
        >
          {selectedNode && (
            <div
              style={{
                marginBottom: 20,
                padding: 12,
                borderRadius: 10,
                border: "1px solid #1e293b",
                background: "#0b1120",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: "#38bdf8",
                  }}
                >
                  ◆ Inspector
                </h3>
                <button
                  onClick={() => deleteNode(selectedNode.id)}
                  style={{
                    padding: "3px 8px",
                    borderRadius: 6,
                    border: "1px solid #7f1d1d",
                    background: "rgba(248,113,113,0.12)",
                    color: "#f87171",
                    fontSize: 11,
                    cursor: "pointer",
                  }}
                >
                  Delete node
                </button>
              </div>
              <p style={{ margin: "0 0 4px", fontSize: 12, color: "#94a3b8" }}>
                {String(selectedNode.data?.label ?? "")} ·{" "}
                {String(selectedNode.type ?? "").replace("_", " ")}
              </p>
              <ConfigEditor
                node={selectedNode}
                update={(key, value) => updateNodeConfig(selectedNode.id, key, value)}
              />
            </div>
          )}
          <h3
            style={{
              margin: "0 0 8px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#34d399",
            }}
          >
            ◆ Result
          </h3>
          {status === "error" && <p style={{ color: "#f87171" }}>{error}</p>}
          {result && (
            <pre
              style={{
                whiteSpace: "pre-wrap",
                fontSize: 13,
                margin: 0,
                padding: 12,
                borderRadius: 10,
                border: "1px solid #1e293b",
                background: "#0b1120",
                color: "#e2e8f0",
              }}
            >
              {result}
            </pre>
          )}
          {telemetry && (
            <div style={{ marginTop: 16 }}>
              <h4
                style={{
                  margin: "0 0 8px",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  color: "#64748b",
                }}
              >
                Telemetry
              </h4>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "#cbd5e1" }}>
                {Object.entries(telemetry).map(([k, v]) => (
                  <li key={k}>
                    <code style={{ color: "#38bdf8" }}>{k}</code>: {String(v)}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!result && !error && status === "idle" && (
            <p style={{ color: "#94a3b8", fontSize: 13 }}>
              Drag nodes from the Palette onto the canvas, connect them, then run the pipeline.
              Double-click a node to rename it — its icon and type stay fixed.
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
