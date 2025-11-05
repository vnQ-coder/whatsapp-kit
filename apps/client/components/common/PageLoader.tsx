"use client";

import { LoadingSpinner } from "./LoadingSpinner";

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <LoadingSpinner size="lg" text="Loading page..." />
    </div>
  );
}

