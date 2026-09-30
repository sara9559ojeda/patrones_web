const STYLES: Record<number, string> = {
  1: "border-terminal-green text-terminal-green bg-terminal-green/10",
  2: "border-biohazard-amber text-biohazard-amber bg-biohazard-amber/10",
  3: "border-umbrella-red-bright text-umbrella-red-bright bg-umbrella-red-bright/10",
  4: "border-hazard-critical text-hazard-critical bg-hazard-critical/20 animate-pulse-critical",
};

const HOVER_BORDER: Record<number, string> = {
  1: "hover:border-terminal-green",
  2: "hover:border-biohazard-amber",
  3: "hover:border-umbrella-red-bright",
  4: "hover:border-hazard-critical",
};

const HOVER_TEXT: Record<number, string> = {
  1: "group-hover:text-terminal-green",
  2: "group-hover:text-biohazard-amber",
  3: "group-hover:text-umbrella-red-bright",
  4: "group-hover:text-hazard-critical",
};

export function riskHoverBorder(grupo: number) {
  return HOVER_BORDER[grupo] ?? HOVER_BORDER[1];
}

export function riskHoverText(grupo: number) {
  return HOVER_TEXT[grupo] ?? HOVER_TEXT[1];
}

const BORDER_LEFT: Record<number, string> = {
  1: "border-l-terminal-green",
  2: "border-l-biohazard-amber",
  3: "border-l-umbrella-red-bright",
  4: "border-l-hazard-critical",
};

export function riskBorderLeft(grupo: number) {
  return BORDER_LEFT[grupo] ?? BORDER_LEFT[1];
}

export function RiskBadge({ grupo }: { grupo: number }) {
  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-mono tracking-widest border ${STYLES[grupo] ?? STYLES[1]}`}
    >
      BSL-{grupo}
    </span>
  );
}
