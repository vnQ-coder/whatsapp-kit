"use client";

import { Handle, Position, NodeProps } from "reactflow";
import { MessageSquare } from "lucide-react";
import { cn } from "../../../lib/utils";

export function MessageNode({ data, selected }: NodeProps) {
  return (
    <div
      className={cn(
        "px-4 py-3 rounded-lg shadow-md border-2 min-w-[200px] bg-card",
        selected
          ? "border-primary shadow-lg"
          : "border-border hover:border-primary/50"
      )}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-full bg-primary/10 mt-0.5">
          <MessageSquare className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-foreground mb-1">
            {data.label || "Message"}
          </div>
          <div className="text-xs text-muted-foreground line-clamp-2">
            {data.content || "No content"}
          </div>
          {data.type && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-primary/10 text-primary">
                {data.type}
              </span>
            </div>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
}

