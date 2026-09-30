type Pattern = "SSG" | "ISR" | "SSR" | "CSR";

const INFO: Record<Pattern, { color: string; nombre: string; motivo: string }> = {
  SSG: {
    color: "text-terminal-green border-terminal-green",
    nombre: "Static Site Generation",
    motivo: "Contenido institucional invariable — generado en build time y servido desde CDN.",
  },
  ISR: {
    color: "text-biohazard-amber border-biohazard-amber",
    nombre: "Incremental Static Regeneration",
    motivo: "Catálogo de referencia que cambia ocasionalmente — regenerado en segundo plano sin rebuild completo.",
  },
  SSR: {
    color: "text-umbrella-red-bright border-umbrella-red-bright",
    nombre: "Server-Side Rendering",
    motivo: "Información crítica que debe estar siempre vigente — renderizada en cada solicitud.",
  },
  CSR: {
    color: "text-hazard-critical border-hazard-critical",
    nombre: "Client-Side Rendering",
    motivo: "Panel autenticado y altamente interactivo — nunca se pre-renderiza ni se cachea contenido sensible.",
  },
};

export function PatternBadge({ pattern }: { pattern: Pattern }) {
  const info = INFO[pattern];
  return (
    <div
      className={`panel-border border-l-4 ${info.color} bg-panel/60 px-4 py-2 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3`}
    >
      <span className={`font-mono font-bold tracking-widest ${info.color}`}>
        [{pattern}]
      </span>
      <span className="text-foreground/70">
        {info.nombre} — {info.motivo}
      </span>
    </div>
  );
}
