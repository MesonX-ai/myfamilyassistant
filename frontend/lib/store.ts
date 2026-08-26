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

export type AgentNodeType = "trigger" | "llm_agent" | "output";

export interface AgentNodeData {
  label: string;
  [key: string]: unknown;
}

interface CanvasState {
  nodes: Node<AgentNodeData>[];
  edges: Edge[];
  query: string;
  result: string | null;
  telemetry: Record<string, unknown> | null;
  status: "idle" | "running" | "success" | "error";
  error: string | null;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (type: AgentNodeType) => void;
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
  query: "",
  result: null,
  telemetry: null,
  status: "idle",
  error: null,
  onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),
  onConnect: (connection) => set({ edges: addEdge(connection, get().edges) }),
  addNode: (type) =>
    set({
      nodes: [
        ...get().nodes,
        {
          id: newNodeId(),
          type,
          position: { x: 140 + Math.random() * 200, y: 80 + get().nodes.length * 120 },
          data: { label: type },
        },
      ],
    }),
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
        `${apiBase}/api/v1/pipeline/execute-canvas`,
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
  clear: () => set({ nodes: [], edges: [], query: "", result: null, telemetry: null, status: "idle", error: null }),
  reset: () => set({ nodes: DEFAULT_NODES, edges: DEFAULT_EDGES, query: "", result: null, telemetry: null, status: "idle", error: null }),
  save: () => {
    try {
      const { nodes, edges, query } = get();
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges, query }));
    } catch {
      // storage unavailable
    }
  },
}));
