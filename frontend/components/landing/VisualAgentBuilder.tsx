"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";

type NodeType = "agent" | "provider" | "connector" | "notification" | "action";

interface CanvasNode {
  id: string;
  type: NodeType;
  label: string;
  icon: string;
  x: number;
  y: number;
  /** Horizontal position as a fraction of canvas width (for responsive rescale) */
  fx: number;
}

interface CanvasEdge {
  id: string;
  from: string;
  to: string;
}

const NODE_W = 168;
const NODE_ANCHOR_Y = 28;

const TYPE_STYLE: Record<NodeType, string> = {
  agent: "border-violet-500/40 bg-violet-500/15 text-violet-300",
  provider: "border-sky-500/40 bg-sky-500/15 text-sky-300",
  connector: "border-cyan-500/40 bg-cyan-500/15 text-cyan-300",
  notification: "border-amber-500/40 bg-amber-500/15 text-amber-300",
  action: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
};

const TYPE_EDGE_COLOR: Record<NodeType, string> = {
  agent: "#a855f7",
  provider: "#38bdf8",
  connector: "#22d3ee",
  notification: "#fbbf24",
  action: "#34d399",
};

const PALETTE: { type: NodeType; label: string; icon: string }[] = [
  { type: "agent", label: "Assistant Bot", icon: "lucide:bot" },
  { type: "provider", label: "Gmail", icon: "logos:google-gmail" },
  { type: "provider", label: "Google Drive", icon: "logos:google-drive" },
  { type: "provider", label: "WhatsApp", icon: "logos:whatsapp-icon" },
  { type: "connector", label: "Webhook", icon: "lucide:plug-zap" },
  { type: "notification", label: "Slack Alert", icon: "lucide:bell" },
  { type: "action", label: "Send Email/Text", icon: "lucide:mail" },
];

// fx = horizontal position as a fraction of canvas width, so the layout
// rescales proportionally at any screen size (design width: 880px)
const INITIAL_NODES: CanvasNode[] = [
  { id: "n1", type: "provider", label: "Gmail", icon: "logos:google-gmail", x: 16, y: 36, fx: 0.018 },
  { id: "n2", type: "provider", label: "Google Drive", icon: "logos:google-drive", x: 16, y: 148, fx: 0.018 },
  { id: "n3", type: "provider", label: "WhatsApp", icon: "logos:whatsapp-icon", x: 16, y: 260, fx: 0.018 },
  { id: "n4", type: "connector", label: "Webhook", icon: "lucide:plug-zap", x: 16, y: 372, fx: 0.018 },
  { id: "n5", type: "agent", label: "Assistant Bot", icon: "lucide:bot", x: 300, y: 200, fx: 0.341 },
  { id: "n6", type: "action", label: "Send Email/Text", icon: "lucide:mail", x: 700, y: 120, fx: 0.795 },
  { id: "n7", type: "notification", label: "Slack Alert", icon: "lucide:bell", x: 700, y: 300, fx: 0.795 },
];

const INITIAL_EDGES: CanvasEdge[] = [
  { id: "e1", from: "n1", to: "n5" },
  { id: "e2", from: "n2", to: "n5" },
  { id: "e3", from: "n3", to: "n5" },
  { id: "e4", from: "n4", to: "n5" },
  { id: "e5", from: "n5", to: "n6" },
  { id: "e6", from: "n5", to: "n7" },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const VisualAgentBuilder = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<string | null>(null);

  const [nodes, setNodes] = useState<CanvasNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<CanvasEdge[]>(INITIAL_EDGES);
  const [linkFrom, setLinkFrom] = useState<string | null>(null);
  const [dragging, setDragging] = useState<{
    id: string;
    dx: number;
    dy: number;
    moved: boolean;
  } | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  linkRef.current = linkFrom;

  const startDrag = (node: CanvasNode, e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-node-delete]")) return;
    e.preventDefault();
    setDragging({
      id: node.id,
      dx: e.clientX - node.x,
      dy: e.clientY - node.y,
      moved: false,
    });
  };

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: PointerEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = clamp(
        e.clientX - rect.left - dragging.dx,
        0,
        Math.max(rect.width - NODE_W, 0),
      );
      const y = clamp(
        e.clientY - rect.top - dragging.dy,
        0,
        Math.max(rect.height - 60, 0),
      );
      setNodes((prev) =>
        prev.map((node) =>
          node.id === dragging.id
            ? { ...node, x, y, fx: rect.width ? x / rect.width : node.fx }
            : node,
        ),
      );
      if (!dragging.moved) setDragging({ ...dragging, moved: true });
    };

    const onUp = () => {
      if (!dragging.moved) handleNodeClick(dragging.id);
      setDragging(null);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging]);

  // Rescale node positions proportionally when the canvas is resized so
  // nodes always fit and no horizontal scrollbar appears.
  useEffect(() => {
    const el = canvasRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      const width = el.getBoundingClientRect().width;
      if (!width) return;
      setNodes((prev) =>
        prev.map((node) => ({
          ...node,
          x: clamp(node.fx * width, 0, Math.max(width - NODE_W, 0)),
        })),
      );
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleNodeClick = (id: string) => {
    const source = linkRef.current;
    if (source && source !== id) {
      setEdges((prev) =>
        prev.some((edge) => edge.from === source && edge.to === id)
          ? prev
          : [...prev, { id: `e-${Date.now()}`, from: source, to: id }],
      );
      setLinkFrom(null);
    } else {
      setLinkFrom(source === id ? null : id);
    }
  };

  const removeNode = (id: string) => {
    setNodes((prev) => prev.filter((node) => node.id !== id));
    setEdges((prev) => prev.filter((edge) => edge.from !== id && edge.to !== id));
    setLinkFrom((prev) => (prev === id ? null : prev));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData("application/x-squark-node");
    if (!raw) return;
    try {
      const payload = JSON.parse(raw) as Omit<CanvasNode, "id" | "x" | "y">;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = clamp(
        e.clientX - rect.left - NODE_W / 2,
        0,
        Math.max(rect.width - NODE_W, 0),
      );
      const node: CanvasNode = {
        ...payload,
        id: `n-${Date.now()}`,
        x,
        y: clamp(e.clientY - rect.top - 28, 0, Math.max(rect.height - 60, 0)),
        fx: rect.width ? x / rect.width : 0.5,
      };
      setNodes((prev) => [...prev, node]);
    } catch {
      // Ignore malformed drop data
    }
  };

  const resetCanvas = () => {
    setNodes(INITIAL_NODES);
    setEdges(INITIAL_EDGES);
    setLinkFrom(null);
  };

  const saveCanvas = () => {
    try {
      localStorage.setItem(
        "myfa-visual-builder",
        JSON.stringify({ nodes, edges }),
      );
      setSavedAt(new Date().toLocaleTimeString());
    } catch {
      // storage unavailable
    }
  };

  useEffect(() => {
    if (!savedAt) return;
    const id = setTimeout(() => setSavedAt(null), 2000);
    return () => clearTimeout(id);
  }, [savedAt]);

  const anchorFor = (node: CanvasNode) => ({
    out: { x: node.x + NODE_W, y: node.y + NODE_ANCHOR_Y },
    in: { x: node.x, y: node.y + NODE_ANCHOR_Y },
  });

  return (
    <section className="section vb-section">
      <style>{`
        .vb-section .vb-grid {
          display: grid;
          gap: 24px;
          grid-template-columns: minmax(0, 1fr) minmax(0, 3fr);
        }
        @media (max-width: 900px) {
          .vb-section .vb-grid { grid-template-columns: 1fr; }
        }
        .vb-palette {
          border: 1px solid var(--border);
          background: var(--surface);
          border-radius: 18px;
          padding: 20px;
          backdrop-filter: blur(14px);
        }
        .vb-item {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: grab;
          border: 1px solid var(--border);
          background: var(--surface-2);
          border-radius: 12px;
          padding: 10px 12px;
          transition: border-color 0.18s ease;
        }
        .vb-item:hover { border-color: rgba(124, 58, 237, 0.5); }
        .vb-item:active { cursor: grabbing; }
        .vb-node-chip {
          height: 34px; width: 34px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 10px; border: 1px solid;
          flex-shrink: 0;
        }
        .vb-canvas {
          border: 1px solid var(--border);
          border-radius: 18px;
          min-height: 460px;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle, rgba(148,163,184,0.14) 1px, transparent 1px);
          background-size: 22px 22px;
        }
        .vb-chip {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 10px; border-radius: 999px;
          font-size: 12px; font-weight: 600;
          border: 1px solid var(--border); background: var(--surface-2);
        }
        .vb-btn {
          padding: 7px 14px; border-radius: 10px;
          font-size: 13px; font-weight: 600;
          border: 1px solid var(--border);
          background: var(--surface-2); color: var(--text);
          transition: background 0.18s ease, transform 0.18s ease;
        }
        .vb-btn:hover { transform: translateY(-1px); }
        .vb-btn-danger { color: #fda4af; border-color: rgba(244,63,94,0.4); }
        .vb-btn-save {
          color: #fff; border: none;
          background: linear-gradient(115deg, #a855f7, #6366f1);
        }
        .vb-node-delete { display: none !important; }
        .vb-node-chip:hover > .vb-node-delete { display: flex !important; }
      `}</style>

      {/* Section header */}
      <div className="container" style={{ marginBottom: 40 }}>
        <div className="eyebrow">
          <Icon icon="lucide:git-fork" style={{ fontSize: 16 }} />
          Visual Agent Builder
        </div>
        <h2 className="section-title">
          Compose family assistant workflows on a live canvas
        </h2>
        <p className="section-sub">
          Drag assistants, providers, connectors, notifications, and actions onto
          the canvas—then click one node and another to wire them together. Build
          your morning briefing, chore reminders, or meal planner visually.
        </p>
      </div>

      <div className="container vb-grid">
        {/* Palette */}
        <aside className="vb-palette">
          <p
            style={{
              margin: "0 0 12px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--muted)",
            }}
          >
            Palette — drag onto canvas
          </p>
          {PALETTE.map((item) => (
            <div
              key={`${item.type}-${item.label}`}
              className="vb-item"
              style={{ marginBottom: 10 }}
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData(
                  "application/x-squark-node",
                  JSON.stringify(item),
                );
                event.dataTransfer.effectAllowed = "copy";
              }}
            >
              <Icon icon="lucide:grip-vertical" style={{ fontSize: 16, color: "var(--muted)" }} />
              <span className={`vb-node-chip ${TYPE_STYLE[item.type]}`}>
                <Icon icon={item.icon} style={{ fontSize: 18 }} />
              </span>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>
                  {item.label}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 10,
                    textTransform: "capitalize",
                    color: "var(--muted)",
                  }}
                >
                  {item.type}
                </p>
              </div>
            </div>
          ))}

          {/* Toolbar */}
          <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 8 }}>
            <span className="vb-chip">{nodes.length} nodes</span>
            <span className="vb-chip">{edges.length} links</span>
            <button
              className="vb-btn vb-btn-danger"
              style={{ marginLeft: "auto" }}
              onClick={() => {
                setNodes([]);
                setEdges([]);
                setLinkFrom(null);
              }}
            >
              Clear
            </button>
            <button className="vb-btn" onClick={resetCanvas}>
              Reset
            </button>
            <button className="vb-btn vb-btn-save" onClick={saveCanvas}>
              {savedAt ? `Saved ${savedAt}` : "Save"}
            </button>
          </div>
        </aside>

        {/* Canvas */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--muted)" }}>
            <span className="vb-chip">
              <Icon icon="lucide:spline" style={{ fontSize: 14 }} />
              {linkFrom ? "Now click a target node to connect" : "Click a node to start a connection"}
            </span>
            <span className="vb-hint" style={{ display: "none" }} />
          </div>

          <div className="vb-canvas" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
            <div
              ref={canvasRef}
              style={{ position: "absolute", inset: 0, minHeight: 460 }}
            >
              {/* Edges */}
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
                <defs>
                  {Object.entries(TYPE_EDGE_COLOR).map(([type, color]) => (
                    <marker
                      key={type}
                      id={`vb-arrow-${type}`}
                      markerHeight="8"
                      markerWidth="8"
                      orient="auto"
                      refX="7"
                      refY="4"
                      viewBox="0 0 10 10"
                      fill={color}
                    >
                      <path d="M 0 0 L 10 4 L 0 10 z" />
                    </marker>
                  ))}
                </defs>
                {edges.map((edge) => {
                  const from = nodes.find((n) => n.id === edge.from);
                  const to = nodes.find((n) => n.id === edge.to);
                  if (!from || !to) return null;
                  const start = anchorFor(from).out;
                  const end = anchorFor(to).in;
                  const bend = Math.max(48, Math.abs(end.x - start.x) / 2);
                  return (
                    <path
                      key={edge.id}
                      d={`M ${start.x} ${start.y} C ${start.x + bend} ${start.y}, ${end.x - bend} ${end.y}, ${end.x} ${end.y}`}
                      fill="none"
                      stroke={TYPE_EDGE_COLOR[from.type]}
                      strokeWidth={2}
                      strokeDasharray="6 6"
                      markerEnd={`url(#vb-arrow-${from.type})`}
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        dur="1s"
                        from="24"
                        to="0"
                        repeatCount="indefinite"
                      />
                    </path>
                  );
                })}
              </svg>

              {/* Nodes */}
              {nodes.map((node) => {
                const isLinkSource = linkFrom === node.id;
                return (
                  <div
                    key={node.id}
                    style={{
                      position: "absolute",
                      left: node.x,
                      top: node.y,
                      zIndex: dragging?.id === node.id ? 20 : 10,
                    }}
                    onPointerDown={(e) => startDrag(node, e)}
                  >
                    <div
                      className={`vb-node-chip ${TYPE_STYLE[node.type]}`}
                      style={{
                        width: NODE_W,
                        height: "auto",
                        padding: "10px 12px",
                        gap: 10,
                        cursor: dragging ? "grabbing" : "grab",
                        boxShadow: "0 18px 40px -22px rgba(0,0,0,0.8)",
                        border: isLinkSource
                          ? "2px solid #fbbf24"
                          : "1px solid var(--border)",
                      }}
                    >
                      <span
                        className={`vb-node-chip ${TYPE_STYLE[node.type]}`}
                        style={{ height: 34, width: 34 }}
                      >
                        <Icon icon={node.icon} style={{ fontSize: 18 }} />
                      </span>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>
                          {node.label}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 10,
                            textTransform: "capitalize",
                            color: "var(--muted)",
                          }}
                        >
                          {node.type}
                        </p>
                      </div>
                      <button
                        aria-label={`Remove ${node.label}`}
                        data-node-delete=""
                        onClick={() => removeNode(node.id)}
                        style={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          height: 20,
                          width: 20,
                          borderRadius: "50%",
                          border: "none",
                          background: "#f43f5e",
                          color: "#fff",
                          fontSize: 12,
                          lineHeight: 1,
                        }}
                        className="vb-node-delete"
                      >
                        <Icon icon="lucide:x" style={{ fontSize: 12 }} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Empty state */}
              {nodes.length === 0 && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none",
                  }}
                >
                  <p
                    style={{
                      border: "1px dashed var(--border)",
                      borderRadius: 12,
                      padding: "16px 24px",
                      fontSize: 14,
                      color: "var(--muted)",
                    }}
                  >
                    Drag items from the palette to build your workflow
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
