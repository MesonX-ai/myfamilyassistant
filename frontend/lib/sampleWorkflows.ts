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
    id: "document-summarizer",
    name: "Document Summarizer & Export",
    description:
      "Upload Word, PDF, or TXT documents. AI summarizes the content into 3 key points, verifies accuracy, and allows download as PDF, DOCX, or TXT.",
    icon: "lucide:file-text",
    sampleInput: "sample.pdf",
    nodes: [
      {
        id: "text-input",
        type: "text_input",
        position: { x: 50, y: 150 },
        data: {
          label: "Upload & Input",
          icon: "lucide:upload-cloud",
          status: "idle",
          config: {
            acceptedFormats: [".pdf", ".docx", ".doc", ".txt"],
            maxFileSize: 10485760,
            variableName: "inputContent",
            placeholder: "Upload document or paste text content...",
            allowFileUpload: true,
            allowTextInput: true,
          },
        },
      },
      {
        id: "doc-parser",
        type: "tool",
        position: { x: 250, y: 150 },
        data: {
          label: "Parse Document",
          icon: "lucide:file-json",
          status: "idle",
          config: {
            toolName: "document_parser",
            description: "Extracts and normalizes text content from uploaded files or pasted text",
          },
        },
      },
      {
        id: "summarizer-agent",
        type: "llm_agent",
        position: { x: 450, y: 80 },
        data: {
          label: "Summarizer Agent",
          icon: "lucide:bot",
          status: "idle",
          config: {
            model: "claude-3-5-sonnet",
            temperature: 0.3,
            systemPrompt:
              "You are a professional document summarization expert. Analyze the extracted document content and create a concise, 3-bullet-point summary. Each bullet should capture the most important concept. Format output as:\n• [Key Point 1]\n• [Key Point 2]\n• [Key Point 3]",
          },
        },
      },
      {
        id: "reviewer-agent",
        type: "llm_agent",
        position: { x: 700, y: 80 },
        data: {
          label: "Reviewer Agent",
          icon: "lucide:shield-check",
          status: "idle",
          config: {
            model: "claude-3-5-sonnet",
            temperature: 0.5,
            systemPrompt:
              "You are a quality assurance reviewer for document summaries. Evaluate the 3-bullet summary against the original document. Verify each point is accurate and no key concepts are missing. Output format:\n[VERIFIED/NEEDS_REVISION]\n✓ [Verification point 1]\n✓ [Verification point 2]\n✓ [Verification point 3]",
          },
        },
      },
      {
        id: "format-converter",
        type: "tool",
        position: { x: 900, y: 150 },
        data: {
          label: "Format Converter",
          icon: "lucide:file-output",
          status: "idle",
          config: {
            toolName: "format_converter",
            description: "Converts summary to PDF, DOCX, or TXT format",
            outputFormats: ["pdf", "docx", "txt"],
          },
        },
      },
      {
        id: "document-summary",
        type: "output",
        position: { x: 1100, y: 100 },
        data: {
          label: "Document Summary",
          icon: "lucide:file-check",
          status: "idle",
          config: {
            displayMode: "preview_with_format_selection",
            showPreviewPanel: true,
            previewHeight: 400,
            formatSelectionLabel: "Export As:",
            downloadFormats: ["txt", "docx", "pdf"],
            allowFormatSelection: true,
            showDownloadButtons: true,
          },
        },
      },
    ],
    edges: [
      {
        id: "e1",
        source: "text-input",
        target: "doc-parser",
        animated: false,
      },
      {
        id: "e2",
        source: "doc-parser",
        target: "summarizer-agent",
        animated: false,
      },
      {
        id: "e3",
        source: "summarizer-agent",
        target: "reviewer-agent",
        animated: false,
      },
      {
        id: "e4",
        source: "reviewer-agent",
        target: "format-converter",
        animated: false,
      },
      {
        id: "e5",
        source: "format-converter",
        target: "document-summary",
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
