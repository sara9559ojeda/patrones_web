import type { ReactNode } from "react";

export function HeroBand({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden border-b border-panel-border">
      <div className="hazard-stripes h-1.5 w-full" />
      <div className="absolute inset-0 bg-grid bg-vignette pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {children}
      </div>
    </div>
  );
}
