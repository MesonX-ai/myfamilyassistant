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

export type AgentNodeType =
  | "trigger"
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
  clear: () => void;
  reset: () => void;
  save: () => void;
}

const STORAGE_KEY = "myfa-canvas-state";

const DEFAULT_NODES: Node<AgentNodeData>[] = [];
const DEFAULT_EDGES: Edge[] = [];

let idCounter = 1;
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
  // transitions, green edge highlighting, and a random failure injector.
  simulate: async () => {
    const { nodes, edges, setNodeStatus, resetExecution } = get();
    if (nodes.length === 0 || get().status === "running") return;
    resetExecution();
    set({ status: "running", error: null, result: null, telemetry: null });
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    await sleep(400);

    const targetIds = new Set(edges.map((e) => e.target));
    const queue = nodes.filter((n) => !targetIds.has(n.id)).map((n) => n.id);
    const executed = new Set<string>();
    const startedAt = Date.now();
    let failedId: string | null = null;
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

      // Random failure injector (~15%) to demonstrate error-state visuals
      if (Math.random() > 0.85) {
        failedId = currentId;
        setNodeStatus(currentId, "failed", "Inference quota exceeded or guardrail blocked the response path.");
        break;
      }
      setNodeStatus(currentId, "completed");
      executed.add(currentId);
      queue.push(...edges.filter((e) => e.source === currentId).map((e) => e.target));
    }

    const total = nodes.length;
    const done = executed.size;
    set({
      activeExecutionId: null,
      status: failedId ? "error" : "success",
      error: failedId
        ? `Simulation halted at node "${nodes.find((n) => n.id === failedId)?.data.label ?? failedId}".`
        : null,
      result: failedId
        ? `Simulation halted: ${done}/${total} nodes completed before the failure.`
        : `Simulation completed: ${done}/${total} nodes executed successfully.`,
      telemetry: {
        mode: "simulation",
        nodes_executed: done,
        nodes_total: total,
        duration_ms: Date.now() - startedAt,
        failed_node: failedId ?? "none",
      },
    });
  },
  setQuery: (q) => set({ query: q }),
  run: async () => {
    const { nodes, edges, query } = get();
    const apiBase = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

    if (!nodes.some((n) => n.type === "trigger")) {
      set({ error: "Canvas must include at least one trigger node.", status: "error" });
      return;
    }
    if (!nodes.some((n) => n.type === "output")) {
      set({ error: "Canvas must include at least one output node.", status: "error" });
      return;
    }

    set({ status: "running", error: null, result: null, telemetry: null });

    try {
      const res = await fetch(
        `${apiBase}/api/v1/pipeline/execute-canvas?initial_query=${encodeURIComponent(query)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workspace_id: "ws-local",
            nodes: nodes.map((n) => ({
              id: n.id,
              type: n.type,
              data: { label: (n.data?.label as string) ?? n.type },
            })),
            edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target })),
          }),
          signal: AbortSignal.timeout(30000),
        },
      );

      if (!res.ok) {
        const detail = (await res.json().catch(() => ({}))) as { detail?: string };
        throw new Error(detail.detail || `HTTP ${res.status}`);
      }

      const data = (await res.json()) as {
        result: string;
        telemetry: Record<string, unknown>;
      };
      set({ result: data.result, telemetry: data.telemetry, status: "success" });
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
