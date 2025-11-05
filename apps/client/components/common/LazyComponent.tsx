"use client";

import { Suspense, ComponentType, ReactNode } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

interface LazyComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function LazyComponent({
  children,
  fallback = <LoadingSpinner size="lg" />,
}: LazyComponentProps) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}

export function withLazyLoading<T extends ComponentType<any>>(
  Component: T,
  fallback?: ReactNode
) {
  const LazyComponent = (props: any) => (
    <Suspense fallback={fallback || <LoadingSpinner size="lg" />}>
      <Component {...props} />
    </Suspense>
  );

  LazyComponent.displayName = `withLazyLoading(${Component.displayName || Component.name})`;

  return LazyComponent;
}

