"use client";

import { useCallback, useState } from "react";
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "../common/Button";
import { Plus, MessageSquare, GitBranch, Zap, Save, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MessageNode } from "./nodes/message-node";
import { ConditionNode } from "./nodes/condition-node";
import { ActionNode } from "./nodes/action-node";
import { cn } from "../../lib/utils";

const nodeTypes: NodeTypes = {
  message: MessageNode,
  condition: ConditionNode,
  action: ActionNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "message",
    position: { x: 250, y: 100 },
    data: {
      label: "Welcome Message",
      content: "Hello! How can I help you today?",
      type: "text",
    },
  },
];

const initialEdges: Edge[] = [];

export function ChatbotFlowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const addNode = (type: string) => {
    const newNode: Node = {
      id: `${Date.now()}`,
      type,
      position: {
        x: Math.random() * 500 + 100,
        y: Math.random() * 400 + 100,
      },
      data:
        type === "message"
          ? {
              label: "New Message",
              content: "",
              type: "text",
            }
          : type === "condition"
          ? {
              label: "New Condition",
              condition: "",
              variable: "",
            }
          : {
              label: "New Action",
              action: "send_message",
            },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  const deleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
    setSelectedNode(null);
  };

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  const updateNodeData = (nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
      )
    );
  };

  const handleSave = () => {
    // Save flow logic here
    console.log("Flow saved:", { nodes, edges });
  };

  return (
    <div className="flex flex-col h-full border rounded-lg bg-card overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b bg-background flex-shrink-0">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Node
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => addNode("message")}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Message
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addNode("condition")}>
                <GitBranch className="mr-2 h-4 w-4" />
                Condition
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addNode("action")}>
                <Zap className="mr-2 h-4 w-4" />
                Action
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          {selectedNode && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => deleteNode(selectedNode.id)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Node
            </Button>
          )}
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Flow
          </Button>
        </div>
      </div>

      {/* Flow Canvas */}
      <div className="flex-1 relative min-h-0">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-background"
          defaultEdgeOptions={{
            style: { stroke: "hsl(var(--primary))", strokeWidth: 2 },
            type: "smoothstep",
          }}
        >
          <Background color="hsl(var(--muted-foreground))" gap={20} />
          <Controls className="bg-card border rounded-lg" />
          <MiniMap
            className="bg-card border rounded-lg"
            nodeColor={(node) => {
              if (node.type === "message") return "hsl(var(--primary))";
              if (node.type === "condition") return "hsl(var(--whatsapp-teal))";
              if (node.type === "action") return "hsl(var(--accent))";
              return "hsl(var(--muted))";
            }}
          />
        </ReactFlow>

        {/* Node Properties Panel */}
        {selectedNode && (
          <div className="absolute top-4 right-4 bg-card border rounded-lg shadow-lg p-4 w-80 z-10">
            <NodePropertiesPanel
              node={selectedNode}
              onUpdate={updateNodeData}
              onClose={() => setSelectedNode(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

interface NodePropertiesPanelProps {
  node: Node;
  onUpdate: (nodeId: string, data: any) => void;
  onClose: () => void;
}

function NodePropertiesPanel({ node, onUpdate, onClose }: NodePropertiesPanelProps) {
  const handleUpdate = (field: string, value: any) => {
    onUpdate(node.id, { [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Node Properties</h3>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          ×
        </Button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            Label
          </label>
          <input
            type="text"
            value={node.data.label || ""}
            onChange={(e) => handleUpdate("label", e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-md bg-background text-foreground"
          />
        </div>

        {node.type === "message" && (
          <>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Message Content
              </label>
              <textarea
                value={node.data.content || ""}
                onChange={(e) => handleUpdate("content", e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background text-foreground min-h-[80px]"
                placeholder="Enter message content..."
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Message Type
              </label>
              <select
                value={node.data.type || "text"}
                onChange={(e) => handleUpdate("type", e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background text-foreground"
              >
                <option value="text">Text</option>
                <option value="image">Image</option>
                <option value="template">Template</option>
              </select>
            </div>
          </>
        )}

        {node.type === "condition" && (
          <>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Variable
              </label>
              <input
                type="text"
                value={node.data.variable || ""}
                onChange={(e) => handleUpdate("variable", e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background text-foreground"
                placeholder="e.g., user_input"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Condition
              </label>
              <select
                value={node.data.condition || ""}
                onChange={(e) => handleUpdate("condition", e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background text-foreground"
              >
                <option value="">Select condition</option>
                <option value="equals">Equals</option>
                <option value="contains">Contains</option>
                <option value="greater_than">Greater Than</option>
                <option value="less_than">Less Than</option>
              </select>
            </div>
          </>
        )}

        {node.type === "action" && (
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Action Type
            </label>
            <select
              value={node.data.action || "send_message"}
              onChange={(e) => handleUpdate("action", e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background text-foreground"
            >
              <option value="send_message">Send Message</option>
              <option value="assign_to_agent">Assign to Agent</option>
              <option value="end_conversation">End Conversation</option>
              <option value="set_variable">Set Variable</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

