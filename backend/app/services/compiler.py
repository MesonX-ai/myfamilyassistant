"""Canvas to LangGraph compiler for visual workflow definitions."""
from typing import Any, Dict, Callable
from langgraph.graph import StateGraph
from ..models.workflow import WorkflowDefinition, NodeType, CanvasNode, CanvasEdge


class CanvasCompiler:
    """Compiles React Flow canvas definitions to executable LangGraph state machines."""
    
    def __init__(self):
        self.node_handlers: Dict[NodeType, Callable] = {
            NodeType.LLM_AGENT: self._handle_llm_agent,
            NodeType.TOOL: self._handle_tool,
            NodeType.SEMANTIC_BRANCH: self._handle_branch,
            NodeType.REFLECTION_LOOP: self._handle_reflection,
            NodeType.OUTPUT: self._handle_output,
            NodeType.HUMAN_IN_THE_LOOP: self._handle_human,
            NodeType.PROMPT_TEMPLATE: self._handle_prompt_template,
            NodeType.TASK_DECOMPOSITION: self._handle_task_decomposition,
        }
    
    def compile(self, workflow: WorkflowDefinition) -> StateGraph:
        """Compile canvas definition to executable StateGraph."""
        state_graph = StateGraph(dict)
        
        # Add nodes
        for node in workflow.nodes:
            handler = self.node_handlers.get(node.type, self._handle_default)
            state_graph.add_node(node.id, handler)
        
        # Add edges
        for edge in workflow.edges:
            state_graph.add_edge(edge.source, edge.target)
        
        # Set entry and exit points
        self._set_entry_points(state_graph, workflow.nodes)
        
        return state_graph.compile()
    
    def _set_entry_points(self, graph: StateGraph, nodes: list):
        """Configure START and END nodes."""
        # Find trigger nodes (entry points)
        trigger_nodes = [n for n in nodes if n.type == NodeType.TRIGGER]
        if trigger_nodes:
            for trigger in trigger_nodes:
                graph.set_entry_point(trigger.id)
        
        # Find output nodes (exit points)
        output_nodes = [n for n in nodes if n.type == NodeType.OUTPUT]
        if output_nodes:
            for output in output_nodes:
                graph.set_finish_point(output.id)
    
    def _handle_llm_agent(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Handle LLM agent node - mock implementation."""
        state["last_output"] = "LLM agent processed: " + str(state.get("input", ""))
        return state
    
    def _handle_tool(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Handle tool execution node."""
        state["last_output"] = "Tool executed with: " + str(state.get("input", ""))
        return state
    
    def _handle_branch(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Handle semantic branching node."""
        state["branch_decision"] = "path_a"
        return state
    
    def _handle_reflection(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Handle reflection loop node."""
        state["reflection"] = "Reflecting on: " + str(state.get("last_output", ""))
        return state
    
    def _handle_output(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Handle output/final result node."""
        state["final_result"] = state.get("last_output", "No output")
        return state
    
    def _handle_human(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Handle human-in-the-loop node."""
        state["awaiting_human_input"] = True
        return state
    
    def _handle_prompt_template(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Handle prompt template node."""
        state["rendered_prompt"] = "Rendered prompt template"
        return state
    
    def _handle_task_decomposition(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Handle task decomposition node."""
        state["decomposed_tasks"] = ["task_1", "task_2", "task_3"]
        return state
    
    def _handle_default(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Default handler for unrecognized node types."""
        return state
