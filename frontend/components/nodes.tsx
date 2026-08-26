import { Handle, Position, type NodeProps } from "reactflow";

const palette: Record<string, { bg: string; border: string }> = {
  trigger: { bg: "rgba(34,197,94,0.15)", border: "#22c55e" },
  llm_agent: { bg: "rgba(59,130,246,0.15)", border: "#3b82f6" },
  output: { bg: "rgba(168,85,247,0.15)", border: "#a855f7" },
};

export function AgentNode({ type, data }: NodeProps) {
  const colors = palette[type ?? "llm_agent"] ?? palette.llm_agent;
  const label = (data?.label as string) ?? type;
  return (
    <div
      style={{
        padding: "10px 14px",
        borderRadius: 12,
        border: `2px solid ${colors.border}`,
        background: colors.bg,
        minWidth: 160,
        color: "#0f172a",
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: "#94a3b8" }} />
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          opacity: 0.7,
        }}
      >
        {type}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{label}</div>
      <Handle type="source" position={Position.Bottom} style={{ background: "#94a3b8" }} />
    </div>
  );
}
