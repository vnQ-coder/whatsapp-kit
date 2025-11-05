"use client";

import { Handle, Position, NodeProps } from "reactflow";
import { Zap } from "lucide-react";
import { cn } from "../../../lib/utils";

export function ActionNode({ data, selected }: NodeProps) {
  const getActionLabel = (action: string) => {
    switch (action) {
      case "send_message":
        return "Send Message";
      case "assign_to_agent":
        return "Assign to Agent";
      case "end_conversation":
        return "End Conversation";
      case "set_variable":
        return "Set Variable";
      default:
        return action;
    }
  };

  return (
    <div
      className={cn(
        "px-4 py-3 rounded-lg shadow-md border-2 min-w-[200px] bg-card",
        selected
          ? "border-accent shadow-lg"
          : "border-border hover:border-accent/50"
      )}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-full bg-accent/10 mt-0.5">
          <Zap className="h-4 w-4 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-foreground mb-1">
            {data.label || "Action"}
          </div>
          {data.action && (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Action:</span> {getActionLabel(data.action)}
            </div>
          )}
          {!data.action && (
            <div className="text-xs text-muted-foreground italic">
              Configure action
            </div>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
}

