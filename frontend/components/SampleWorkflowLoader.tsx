"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { useCanvasStore } from "@/lib/store";
import { SAMPLE_WORKFLOWS, getAvailableSampleWorkflows } from "@/lib/sampleWorkflows";

interface SampleWorkflowLoaderProps {
  onClose?: () => void;
}

export function SampleWorkflowLoader({ onClose }: SampleWorkflowLoaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { loadWorkflow } = useCanvasStore();

  const handleSelectWorkflow = (workflowId: string) => {
    const workflow = SAMPLE_WORKFLOWS.find((w) => w.id === workflowId);
    if (!workflow) return;

    // Load the workflow into the canvas
    loadWorkflow(workflow.nodes, workflow.edges, workflow.sampleInput);

    // Close menu and notify parent
    setIsOpen(false);
    onClose?.();
  };

  const workflows = getAvailableSampleWorkflows();

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: "6px 14px",
          borderRadius: 8,
          border: "1px solid #334155",
          background: "#1e293b",
          color: "#e2e8f0",
          fontSize: 13,
          fontWeight: 500,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          transition: "all 0.2s ease",
        }}
        title="Load a sample workflow to get started"
      >
        <Icon icon="lucide:zap" width={16} />
        Sample Flow
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: 8,
            zIndex: 50,
            minWidth: 300,
            maxWidth: 400,
            borderRadius: 10,
            border: "1px solid #334155",
            background: "#0f172a",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
            padding: 12,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#818cf8",
              marginBottom: 12,
              paddingBottom: 8,
              borderBottom: "1px solid #1e293b",
            }}
          >
            💡 Sample Workflows
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {workflows.map((workflow) => (
              <button
                key={workflow.id}
                onClick={() => handleSelectWorkflow(workflow.id)}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  border: "1px solid #1e293b",
                  background: "#0b1120",
                  color: "#e2e8f0",
                  fontSize: 13,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#1e293b";
                  (e.currentTarget as HTMLElement).style.borderColor = "#334155";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#0b1120";
                  (e.currentTarget as HTMLElement).style.borderColor = "#1e293b";
                }}
              >
                <Icon
                  icon={workflow.icon}
                  width={20}
                  height={20}
                  style={{ flexShrink: 0, color: "#38bdf8", marginTop: 2 }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      marginBottom: 4,
                      color: "#e2e8f0",
                    }}
                  >
                    {workflow.name}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#94a3b8",
                      lineHeight: 1.4,
                    }}
                  >
                    {workflow.description}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div
            style={{
              marginTop: 12,
              paddingTop: 12,
              borderTop: "1px solid #1e293b",
              fontSize: 12,
              color: "#64748b",
            }}
          >
            {`✨ These examples include sample input text. Just click "Run Pipeline" to execute them with your sQuark Flow backend!`}
          </div>
        </div>
      )}

      {isOpen && (
        <button
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,
            background: "transparent",
            border: "none",
            cursor: "default",
            padding: 0,
          }}
          onClick={() => setIsOpen(false)}
          aria-label="Close sample workflow menu"
        />
      )}
    </div>
  );
}
