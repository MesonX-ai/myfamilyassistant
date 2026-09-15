import type { Node, Edge } from "reactflow";
import type { AgentNodeData } from "@/lib/store";

export interface SampleWorkflow {
  id: string;
  name: string;
  description: string;
  icon: string;
  nodes: Node<AgentNodeData>[];
  edges: Edge[];
  sampleInput?: string;
}

export const SAMPLE_WORKFLOWS: SampleWorkflow[] = [
  {
    id: "summarizer-reviewer",
    name: "Summarizer & Reviewer",
    description:
      "Two-agent workflow: Summarizer creates a 3-bullet summary, then Reviewer critiques it for accuracy and completeness.",
    icon: "lucide:split-square-vertical",
    sampleInput:
      "Artificial intelligence (AI) has revolutionized multiple industries over the past decade. From healthcare diagnostics to autonomous vehicles, AI systems are becoming increasingly sophisticated. Machine learning algorithms can now recognize patterns in massive datasets that would take humans years to analyze. However, challenges remain including data privacy concerns, algorithmic bias, and the need for interpretable AI systems. Leading tech companies are investing billions into AI research, while governments worldwide are developing policies to ensure responsible AI development.",
    nodes: [
      {
        id: "input-trigger",
        type: "text_input",
        position: { x: 50, y: 150 },
        data: {
          label: "Text Input",
          icon: "lucide:inbox",
          status: "idle",
          config: {
            input: "",
            variableName: "userInput",
          },
        },
      },
      {
        id: "summarizer-agent",
        type: "llm_agent",
        position: { x: 300, y: 80 },
        data: {
          label: "Summarizer Agent",
          icon: "lucide:bot",
          status: "idle",
          config: {
            model: "claude-3-5-sonnet",
            temperature: 0.3,
            systemPrompt:
              "You are a professional summarization agent. Create a concise, 3-bullet-point summary of the provided text. Each bullet should capture a key concept.",
          },
        },
      },
      {
        id: "reviewer-agent",
        type: "llm_agent",
        position: { x: 550, y: 80 },
        data: {
          label: "Reviewer Agent",
          icon: "lucide:shield-check",
          status: "idle",
          config: {
            model: "claude-3-5-sonnet",
            temperature: 0.5,
            systemPrompt:
              "You are a quality assurance reviewer. Evaluate the summary for accuracy against the original text. Check for hallucinations and missing critical facts. Output: VERIFIED (if accurate) or REWRITE (with corrections).",
          },
        },
      },
      {
        id: "final-summary",
        type: "output",
        position: { x: 800, y: 80 },
        data: {
          label: "Final Summary Output",
          icon: "lucide:file-text",
          status: "idle",
          config: {},
        },
      },
    ],
    edges: [
      {
        id: "e1",
        source: "input-trigger",
        target: "summarizer-agent",
        animated: false,
      },
      {
        id: "e2",
        source: "summarizer-agent",
        target: "reviewer-agent",
        animated: false,
      },
      {
        id: "e3",
        source: "reviewer-agent",
        target: "final-summary",
        animated: false,
      },
    ],
  },
];

/**
 * Load a sample workflow into the canvas
 */
export function loadSampleWorkflow(
  workflowId: string,
  onLoadCallback: (workflow: SampleWorkflow) => void,
) {
  const workflow = SAMPLE_WORKFLOWS.find((w) => w.id === workflowId);
  if (!workflow) {
    console.error(`Sample workflow "${workflowId}" not found`);
    return;
  }
  onLoadCallback(workflow);
}

/**
 * Get all available sample workflows
 */
export function getAvailableSampleWorkflows() {
  return SAMPLE_WORKFLOWS.map((w) => ({
    id: w.id,
    name: w.name,
    description: w.description,
    icon: w.icon,
  }));
}
