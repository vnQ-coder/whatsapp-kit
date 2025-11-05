"use client";

import { Handle, Position, NodeProps } from "reactflow";
import { GitBranch } from "lucide-react";
import { cn } from "../../../lib/utils";

export function ConditionNode({ data, selected }: NodeProps) {
  return (
    <div
      className={cn(
        "px-4 py-3 rounded-lg shadow-md border-2 min-w-[200px] bg-card",
        selected
          ? "border-whatsapp-teal shadow-lg"
          : "border-border hover:border-whatsapp-teal/50"
      )}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-full bg-whatsapp-teal/10 mt-0.5">
          <GitBranch className="h-4 w-4 text-whatsapp-teal" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-foreground mb-1">
            {data.label || "Condition"}
          </div>
          {data.variable && (
            <div className="text-xs text-muted-foreground mb-1">
              <span className="font-medium">Variable:</span> {data.variable}
            </div>
          )}
          {data.condition && (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Condition:</span> {data.condition}
            </div>
          )}
          {!data.variable && !data.condition && (
            <div className="text-xs text-muted-foreground italic">
              Configure condition
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-3">
        <Handle
          type="source"
          position={Position.Bottom}
          id="true"
          className="w-3 h-3 bg-primary"
        />
        <div className="text-xs text-muted-foreground px-2">True</div>
        <div className="text-xs text-muted-foreground px-2">False</div>
        <Handle
          type="source"
          position={Position.Bottom}
          id="false"
          className="w-3 h-3 bg-muted-foreground"
        />
      </div>
    </div>
  );
}

