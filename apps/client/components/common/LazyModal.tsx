"use client";

import { Suspense, lazy } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

const LazyModalComponent = lazy(() => 
  import("./Modal").then((module) => ({ default: module.Modal }))
);

interface LazyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export function LazyModal(props: LazyModalProps) {
  if (!props.open) return null;

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[200px]">
          <LoadingSpinner size="sm" />
        </div>
      }
    >
      <LazyModalComponent {...props} />
    </Suspense>
  );
}
