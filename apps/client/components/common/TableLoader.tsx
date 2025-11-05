"use client";

import { LoadingSpinner } from "./LoadingSpinner";

export function TableLoader() {
  return (
    <div className="flex items-center justify-center py-12">
      <LoadingSpinner text="Loading data..." />
    </div>
  );
}

