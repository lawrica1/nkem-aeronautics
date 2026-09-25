"use client";

import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

export function Reveal({ as: Tag = "div", delay = 0, className, children, ...props }) {
  const [ref, isInView] = useInView();

  return (
    <Tag
      ref={ref}
      className={cn(!isInView && "opacity-0", isInView && "animate-fade-up", className)}
      style={isInView ? { animationDelay: `${delay}ms` } : undefined}
      {...props}
    >
      {children}
    </Tag>
  );
}
