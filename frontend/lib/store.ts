import { create } from "zustand";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
} from "reactflow";
import { SAMPLE_WORKFLOWS } from "@/lib/sampleWorkflows";

export type AgentNodeType =
  | "trigger"
  | "text_input"
  | "llm_agent"
  | "output"
  | "agent"
  | "context"
  | "memory"
  | "task_decomposition"
  | "prompt_template"
  | "multi_agent_router"
  | "tool"
  | "mcp"
  | "semantic_branch"
  | "reflection_loop"
  | "human_in_the_loop"
  | "guardrail";

export type AgentNodeStatus = "idle" | "running" | "completed" | "failed" | "paused";

export interface AgentNodeData {
  label: string;
  icon?: string;
  status?: AgentNodeStatus;
  error?: string;
  output?: string;
  config?: Record<string, unknown>;
  [key: string]: unknown;
}

interface CanvasState {
  nodes: Node<AgentNodeData>[];
  edges: Edge[];
  query: string;
  result: string | null;
  telemetry: Record<string, unknown> | null;
  selectedNodeId: string | null;
  activeExecutionId: string | null;
  status: "idle" | "running" | "success" | "error";
  error: string | null;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (
    type: AgentNodeType,
    opts?: { label?: string; icon?: string; position?: { x: number; y: number } },
  ) => void;
  updateNodeLabel: (id: string, label: string) => void;
  setSelectedNodeId: (id: string | null) => void;
  updateNodeData: (id: string, data: Partial<AgentNodeData>) => void;
  updateNodeConfig: (id: string, key: string, value: unknown) => void;
  deleteNode: (id: string) => void;
  setNodeStatus: (id: string, status: AgentNodeStatus, error?: string) => void;
  resetExecution: () => void;
  simulate: () => Promise<void>;
  setQuery: (q: string) => void;
  run: () => Promise<void>;
  loadWorkflow: (nodes: Node<AgentNodeData>[], edges: Edge[], query?: string) => void;
  clear: () => void;
  reset: () => void;
  save: () => void;
}

const STORAGE_KEY = "myfa-canvas-state";

// Initialize with the Document Summarizer sample workflow
const documentSummarizerWorkflow = SAMPLE_WORKFLOWS.find(w => w.id === "document-summarizer");
const DEFAULT_NODES: Node<AgentNodeData>[] = documentSummarizerWorkflow?.nodes || [];
const DEFAULT_EDGES: Edge[] = documentSummarizerWorkflow?.edges || [];

let idCounter = 100;
const newNodeId = () => `node_${idCounter++}`;

export const useCanvasStore = create<CanvasState>((set, get) => ({
  nodes: DEFAULT_NODES,
  edges: DEFAULT_EDGES,
  selectedNodeId: null,
  activeExecutionId: null,
  query: "",
  result: null,
  telemetry: null,
  status: "idle",
  error: null,
  onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),
  onConnect: (connection) => set({ edges: addEdge(connection, get().edges) }),
  addNode: (type, opts) =>
    set({
      nodes: [
        ...get().nodes,
        {
          id: newNodeId(),
          type,
          position:
            opts?.position ?? (() => {
              // Cascade newly added nodes from the top-left corner
              const i = get().nodes.length;
              const col = i % 4;
              const row = Math.floor(i / 4) % 4;
              return { x: 40 + col * 200, y: 40 + row * 140 };
            })(),
          data: { label: opts?.label ?? type, icon: opts?.icon, status: "idle", config: {} },
        },
      ],
    }),
  updateNodeLabel: (id, label) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, label } } : n,
      ),
    }),
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  updateNodeData: (id, data) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n,
      ),
    }),
  updateNodeConfig: (id, key, value) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id === id
          ? { ...n, data: { ...n.data, config: { ...(n.data?.config ?? {}), [key]: value } } }
          : n,
      ),
    }),
  deleteNode: (id) =>
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
    }),
  setNodeStatus: (id, status, errorMsg) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, status, error: errorMsg } } : n,
      ),
    }),
  resetExecution: () =>
    set({
      nodes: get().nodes.map((n) => ({
        ...n,
        data: { ...n.data, status: "idle" as AgentNodeStatus, error: undefined },
      })),
      edges: get().edges.map((e) => ({
        ...e,
        animated: true,
        style: { stroke: "#818cf8", strokeWidth: 2, strokeDasharray: "6 4" },
      })),
      activeExecutionId: null,
    }),
  // Visual execution trace per spec §5: BFS from root nodes, live status
  // transitions, green edge highlighting, and collecting node outputs.
  simulate: async () => {
    const { nodes, edges, setNodeStatus, resetExecution, query } = get();
    if (nodes.length === 0 || get().status === "running") return;
    resetExecution();
    set({ status: "running", error: null, result: null, telemetry: null });
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    await sleep(400);

    // Generate sample outputs for each node based on type
    const nodeOutputs: Record<string, string> = {};
    // Handle both "text_input" and "trigger" types as input nodes
    const inputNode = nodes.find((n) => n.type === "text_input" || n.type === "trigger");
    if (inputNode) {
      const inputText = String(inputNode.data?.config?.input || query || "[Sample Input]");
      nodeOutputs[inputNode.id] = inputText;
    }

    const targetIds = new Set(edges.map((e) => e.target));
    const queue = nodes.filter((n) => !targetIds.has(n.id)).map((n) => n.id);
    const executed = new Set<string>();
    const startedAt = Date.now();
    let guard = 0;

    while (queue.length > 0 && guard++ < 1000) {
      const currentId = queue.shift()!;
      if (executed.has(currentId)) continue;
      const parents = edges.filter((e) => e.target === currentId).map((e) => e.source);
      if (parents.length > 0 && !parents.every((p) => executed.has(p))) continue;

      set({ activeExecutionId: currentId });
      setNodeStatus(currentId, "running");
      set({
        edges: get().edges.map((e) =>
          e.target === currentId
            ? { ...e, animated: true, style: { stroke: "#22c55e", strokeWidth: 2, strokeDasharray: "6 4" } }
            : e,
        ),
      });
      await sleep(1200);

      // Generate output for this node
      const currentNode = nodes.find((n) => n.id === currentId);
      if (currentNode) {
        const parentInputs = parents.map((id) => nodeOutputs[id] ?? "").join("\n");
        let output = "";
        
        if (currentNode.type === "text_input" || currentNode.type === "trigger") {
          output = String(currentNode.data?.config?.input ?? "");
        } else if (currentNode.type === "llm_agent") {
          const label = currentNode.data?.label ?? "Agent";
          if (label.toLowerCase().includes("summarizer")) {
            output = "Summary:\n• AI has revolutionized multiple industries through advanced algorithms\n• Machine learning can now recognize patterns in massive datasets\n• Key challenges include data privacy, algorithmic bias, and interpretability";
          } else if (label.toLowerCase().includes("reviewer")) {
            output = "VERIFIED - Summary is accurate.\n✓ All three points have factual basis in the source\n✓ No hallucinations detected\n✓ Key concepts properly captured";
          } else {
            output = `[${label} output: Processing complete]`;
          }
        } else if (currentNode.type === "output") {
          output = parentInputs || "[Output ready]";
        } else {
          output = `[${currentNode.data?.label ?? "Node"} processed]`;
        }

        nodeOutputs[currentId] = output;
      }

      setNodeStatus(currentId, "completed");
      executed.add(currentId);
      queue.push(...edges.filter((e) => e.source === currentId).map((e) => e.target));
    }

    const total = nodes.length;
    const done = executed.size;
    
    // Collect outputs from output nodes
    const outputNodes = nodes.filter((n) => n.type === "output");
    const resultOutput = outputNodes
      .map((node) => {
        const output = nodeOutputs[node.id] || "[No output generated]";
        return `${node.data?.label || "Output"}:\n${output}`;
      })
      .join("\n\n");
    
    const finalResult = resultOutput 
      ? resultOutput 
      : `Simulation completed: ${done}/${total} nodes executed successfully.`;
    
    set({
      activeExecutionId: null,
      status: "success",
      error: null,
      result: finalResult,
      telemetry: {
        mode: "simulation",
        nodes_executed: done,
        nodes_total: total,
        duration_ms: Date.now() - startedAt,
        failed_node: "none",
      },
    });
  },
  setQuery: (q) => set({ query: q }),
  loadWorkflow: (workflowNodes, workflowEdges, workflowQuery) => {
    set({
      nodes: workflowNodes,
      edges: workflowEdges,
      query: workflowQuery ?? "",
      result: null,
      telemetry: null,
      status: "idle",
      error: null,
      selectedNodeId: null,
      activeExecutionId: null,
    });
  },
  run: async () => {
    const { nodes, edges, query } = get();
    // Point to unified sQuark-flow backend (Bedrock + Claude 3.5 Sonnet integration)
    const apiBase = process.env.NEXT_PUBLIC_API_BASE ?? "https://api.squark-flow.ai";

    if (!nodes.some((n) => n.type === "trigger" || n.type === "text_input")) {
      set({ error: "Canvas must include at least one input node.", status: "error" });
      return;
    }
    if (!nodes.some((n) => n.type === "output")) {
      set({ error: "Canvas must include at least one output node.", status: "error" });
      return;
    }

    set({ status: "running", error: null, result: null, telemetry: null });

    try {
      // Call sQuark-flow execution endpoint with proper ExecutionRequest format
      const res = await fetch(
        `${apiBase}/api/v1/executions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workflow_id: "wf-canvas-demo",
            workspace_id: "ws-myfamilyassistant",
            initial_input: query || "[Default Canvas Input]",
            streaming: false,
          }),
          signal: AbortSignal.timeout(60000), // 60s timeout for LLM execution
        },
      );

      if (!res.ok) {
        const detail = (await res.json().catch(() => ({}))) as { detail?: string; error?: string };
        throw new Error(detail.detail || detail.error || `HTTP ${res.status}`);
      }

      const data = (await res.json()) as any;
      const output = data.result?.output || data.result || "Execution completed";
      const cost = data.total_cost_usd || 0;
      
      set({ 
        result: output, 
        telemetry: {
          cost_usd: cost,
          token_usage: data.token_usage,
          execution_id: data.execution_id,
          model: "claude-3-5-sonnet",
          provider: "aws-bedrock",
        }, 
        status: "success" 
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Execution failed",
        status: "error",
      });
    }
  },
  clear: () => set({ nodes: [], edges: [], query: "", result: null, telemetry: null, status: "idle", error: null, selectedNodeId: null, activeExecutionId: null }),
  reset: () => set({ nodes: DEFAULT_NODES, edges: DEFAULT_EDGES, query: "", result: null, telemetry: null, status: "idle", error: null, selectedNodeId: null, activeExecutionId: null }),
  save: () => {
    try {
      const { nodes, edges, query } = get();
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges, query }));
    } catch {
      // storage unavailable
    }
  },
}));
