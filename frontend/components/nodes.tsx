"use client";

import { memo, useEffect, useRef, useState } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { Icon } from "@iconify/react";
import { useCanvasStore, type AgentNodeType, type AgentNodeStatus } from "@/lib/store";

/** Type accents + fallback icons, matching the homepage builder's node chips */
const TYPE_STYLE: Record<AgentNodeType, { accent: string; icon: string }> = {
  trigger: { accent: "#22d3ee", icon: "lucide:plug-zap" },
  llm_agent: { accent: "#a855f7", icon: "lucide:bot" },
  output: { accent: "#34d399", icon: "lucide:mail" },
  agent: { accent: "#a855f7", icon: "lucide:bot" },
  context: { accent: "#818cf8", icon: "lucide:database" },
  memory: { accent: "#818cf8", icon: "lucide:brain" },
  task_decomposition: { accent: "#f472b6", icon: "lucide:layers" },
  prompt_template: { accent: "#f472b6", icon: "lucide:terminal" },
  multi_agent_router: { accent: "#f472b6", icon: "lucide:git-fork" },
  tool: { accent: "#38bdf8", icon: "lucide:wrench" },
  mcp: { accent: "#38bdf8", icon: "lucide:cpu" },
  semantic_branch: { accent: "#fbbf24", icon: "lucide:split" },
  reflection_loop: { accent: "#fbbf24", icon: "lucide:refresh-cw" },
  human_in_the_loop: { accent: "#f87171", icon: "lucide:user-check" },
  guardrail: { accent: "#f87171", icon: "lucide:shield-alert" },
};

/** Execution status colors (spec §3 status styles, dark-theme adapted) */
const STATUS_COLOR: Record<AgentNodeStatus, string> = {
  idle: "#64748b",
  running: "#6366f1",
  completed: "#34d399",
  failed: "#f87171",
  paused: "#fbbf24",
};

const hexToRgba = (hex: string, alpha: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

export const AgentNode = memo(function AgentNode({ id, type, data, selected }: NodeProps) {
  const nodeType = (type ?? "llm_agent") as AgentNodeType;
  const style = TYPE_STYLE[nodeType] ?? TYPE_STYLE.llm_agent;
  const label = (data?.label as string) ?? String(type);
  const icon = (data?.icon as string) ?? style.icon;
  const nodeStatus = ((data?.status as string) ?? "idle") as AgentNodeStatus;
  const statusColor = STATUS_COLOR[nodeStatus] ?? STATUS_COLOR.idle;
  const hasRunState = nodeStatus === "running" || nodeStatus === "completed" || nodeStatus === "failed" || nodeStatus === "paused";
  const updateNodeLabel = useCanvasStore((s) => s.updateNodeLabel);

  // Inline label editing — only the text is editable; icon and type never change.
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editing) setDraft(label);
  }, [label, editing]);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const commit = () => {
    const next = draft.trim();
    if (next && next !== label) updateNodeLabel(id, next);
    setEditing(false);
  };

  const typeCaption = nodeType.replace("_", " ");

  return (
    <div
      className={nodeStatus === "running" ? "myfa-node-running" : undefined}
      title={(data?.error as string) ?? undefined}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: 168,
        padding: "10px 12px",
        borderRadius: 10,
        border: hasRunState
          ? `2px solid ${statusColor}`
          : selected
            ? "2px solid #fbbf24"
            : `1px solid ${hexToRgba(style.accent, 0.4)}`,
        background: hexToRgba(style.accent, 0.15),
        boxShadow: "0 18px 40px -22px rgba(0,0,0,0.8)",
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setEditing(true);
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: style.accent,
          width: 12,
          height: 12,
          border: "2px solid #0b1120",
        }}
      />
      <span
        style={{
          height: 34,
          width: 34,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 10,
          border: `1px solid ${hexToRgba(style.accent, 0.4)}`,
          background: hexToRgba(style.accent, 0.15),
          flexShrink: 0,
        }}
      >
        <Icon icon={icon} style={{ fontSize: 18, color: style.accent }} />
      </span>
      <div style={{ minWidth: 0, flex: 1 }}>
        {editing ? (
          <input
            ref={inputRef}
            value={draft}
            autoFocus
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") setEditing(false);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              borderBottom: `1px solid ${style.accent}`,
              outline: "none",
              padding: 0,
              fontSize: 13,
              fontWeight: 600,
              lineHeight: 1.2,
              color: style.accent,
            }}
          />
        ) : (
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, lineHeight: 1.2, color: style.accent }}>
            {label}
          </p>
        )}
        <p
          style={{
            margin: 0,
            fontSize: 10,
            textTransform: "capitalize",
            color: "#94a3b8",
          }}
        >
          {typeCaption}
        </p>
      </div>
      <span
        style={{
          width: 9,
          height: 9,
          borderRadius: "50%",
          flexShrink: 0,
          background: statusColor,
          boxShadow: nodeStatus === "running" ? `0 0 8px ${statusColor}` : "none",
        }}
        title={`Status: ${nodeStatus}`}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: style.accent,
          width: 12,
          height: 12,
          border: "2px solid #0b1120",
        }}
      />
    </div>
  );
});
