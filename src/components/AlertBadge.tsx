import type { NivelAlerta } from "@/lib/db";

const STYLES: Record<NivelAlerta, string> = {
  bajo: "border-terminal-green text-terminal-green bg-terminal-green/10",
  medio: "border-biohazard-amber text-biohazard-amber bg-biohazard-amber/10",
  alto: "border-umbrella-red-bright text-umbrella-red-bright bg-umbrella-red-bright/10",
  critico:
    "border-hazard-critical text-hazard-critical bg-hazard-critical/20 animate-pulse-critical",
};

const LABEL: Record<NivelAlerta, string> = {
  bajo: "NIVEL BAJO",
  medio: "NIVEL MEDIO",
  alto: "NIVEL ALTO",
  critico: "CRÍTICO",
};

const BORDER_LEFT: Record<NivelAlerta, string> = {
  bajo: "border-l-terminal-green",
  medio: "border-l-biohazard-amber",
  alto: "border-l-umbrella-red-bright",
  critico: "border-l-hazard-critical",
};

export function alertBorderLeft(nivel: NivelAlerta) {
  return BORDER_LEFT[nivel];
}

export function AlertBadge({ nivel }: { nivel: NivelAlerta }) {
  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-mono tracking-widest border uppercase ${STYLES[nivel]}`}
    >
      {LABEL[nivel]}
    </span>
  );
}
