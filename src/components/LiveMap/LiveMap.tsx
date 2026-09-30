"use client";

import { useMemo, useState } from "react";
import type { Alert, NivelAlerta } from "@/lib/db";
import { REGION_NODES } from "@/data/regions";
import { generateStars } from "./stars";

const SEVERITY_COLOR: Record<NivelAlerta, string> = {
  bajo: "#3ddc84",
  medio: "#f0a500",
  alto: "#e2231a",
  critico: "#ff2b2b",
};

const SEVERITY_RANK: Record<NivelAlerta, number> = {
  bajo: 1,
  medio: 2,
  alto: 3,
  critico: 4,
};

const INACTIVE_COLOR = "#3a3f42";
const STARS = generateStars(90);

export function LiveMap({ alerts }: { alerts: Alert[] }) {
  const [zoom, setZoom] = useState(1);
  const [enVivo, setEnVivo] = useState(true);

  const porRegion = useMemo(() => {
    const map = new Map<string, Alert[]>();
    for (const alerta of alerts) {
      const lista = map.get(alerta.region) ?? [];
      lista.push(alerta);
      map.set(alerta.region, lista);
    }
    return map;
  }, [alerts]);

  const nodosConDatos = useMemo(() => {
    const regionesConAlerta = new Set(alerts.map((a) => a.region));
    const nodos = REGION_NODES.filter(
      (n) => n.hub || regionesConAlerta.has(n.id)
    );
    return nodos.map((nodo) => {
      const alertasRegion = porRegion.get(nodo.id) ?? [];
      const activas = alertasRegion.filter((a) => a.estado === "activa");
      const relevantes = nodo.hub ? alerts.filter((a) => a.estado === "activa") : activas;
      const peor = relevantes.reduce<NivelAlerta | null>((acc, a) => {
        if (!acc || SEVERITY_RANK[a.nivel] > SEVERITY_RANK[acc]) return a.nivel;
        return acc;
      }, null);
      return {
        ...nodo,
        color: peor ? SEVERITY_COLOR[peor] : INACTIVE_COLOR,
        activo: relevantes.length > 0,
        total: alertasRegion.length,
      };
    });
  }, [alerts, porRegion]);

  const hub = nodosConDatos.find((n) => n.hub) ?? nodosConDatos[0];
  const spokes = nodosConDatos.filter((n) => !n.hub);

  const stats = useMemo(() => {
    const activas = alerts.filter((a) => a.estado === "activa");
    return {
      total: alerts.length,
      activas: activas.length,
      critico: activas.filter((a) => a.nivel === "critico").length,
      alto: activas.filter((a) => a.nivel === "alto").length,
      medio: activas.filter((a) => a.nivel === "medio").length,
      bajo: activas.filter((a) => a.nivel === "bajo").length,
    };
  }, [alerts]);

  return (
    <div className="relative w-full h-[420px] sm:h-[520px] overflow-clip bg-black panel-border">
      {/* Fondo espacial */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,#0d1a12_0%,#000_65%)]" />
      {STARS.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-flicker"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            opacity: 0.6,
          }}
        />
      ))}

      {/* Curvatura de "globo" al borde derecho */}
      <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full border border-terminal-green/20 pointer-events-none" />
      <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full border border-terminal-green/10 scale-90 pointer-events-none" />

      {/* Red de nodos */}
      <div
        className="absolute inset-0 transition-transform duration-300"
        style={{ transform: `scale(${zoom})` }}
      >
        <svg viewBox="0 0 1000 560" className="w-full h-full">
          <g opacity={0.25}>
            {Array.from({ length: 11 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 100} y1={0} x2={i * 100} y2={560} stroke="#1c2b22" strokeWidth={1} />
            ))}
            {Array.from({ length: 7 }).map((_, i) => (
              <line key={`h${i}`} x1={0} y1={i * 93.3} x2={1000} y2={i * 93.3} stroke="#1c2b22" strokeWidth={1} />
            ))}
          </g>

          {hub &&
            spokes.map((nodo) => (
              <g key={nodo.id}>
                <line
                  x1={hub.x}
                  y1={hub.y}
                  x2={nodo.x}
                  y2={nodo.y}
                  stroke={nodo.color}
                  strokeWidth={nodo.activo ? 1.5 : 1}
                  strokeOpacity={nodo.activo ? 0.55 : 0.2}
                  strokeDasharray="3 7"
                />
                {nodo.activo && enVivo && (
                  <circle r={4} fill={nodo.color}>
                    <animateMotion
                      dur={nodo.color === SEVERITY_COLOR.critico ? "1.2s" : "2.4s"}
                      repeatCount="indefinite"
                      path={`M${hub.x},${hub.y} L${nodo.x},${nodo.y}`}
                    />
                  </circle>
                )}
              </g>
            ))}

          {nodosConDatos.map((nodo) => (
            <g key={`marker-${nodo.id}`} transform={`translate(${nodo.x} ${nodo.y})`}>
              {nodo.activo && (
                <circle r={nodo.hub ? 22 : 14} fill="none" stroke={nodo.color} strokeWidth={1.5} opacity={0.5}>
                  {enVivo && (
                    <animate attributeName="r" values={`${nodo.hub ? 10 : 6};${nodo.hub ? 26 : 18}`} dur="1.8s" repeatCount="indefinite" />
                  )}
                  {enVivo && <animate attributeName="opacity" values="0.6;0" dur="1.8s" repeatCount="indefinite" />}
                </circle>
              )}
              <rect
                width={nodo.hub ? 16 : 10}
                height={nodo.hub ? 16 : 10}
                x={nodo.hub ? -8 : -5}
                y={nodo.hub ? -8 : -5}
                transform="rotate(45)"
                fill={nodo.color}
                opacity={nodo.activo ? 1 : 0.4}
              />
              <text
                x={0}
                y={nodo.hub ? 34 : 24}
                textAnchor="middle"
                fill={nodo.activo ? nodo.color : "#6b6b6b"}
                fontSize={nodo.hub ? 13 : 11}
                fontFamily="var(--font-share-tech-mono), monospace"
                letterSpacing={1}
              >
                {nodo.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Panel flotante de estadísticas */}
      <div className="absolute top-4 left-4 w-64 bg-black/80 backdrop-blur panel-border border-terminal-green/30">
        <div className="px-4 py-3 border-b border-panel-border flex items-center justify-between">
          <div>
            <h3 className="font-sans font-bold text-sm tracking-wider text-terminal-green">
              RED DE VIGILANCIA
            </h3>
            <p className="text-[10px] text-foreground/50 font-mono">
              CNBVM · COBERTURA NACIONAL
            </p>
          </div>
          <span
            className={`size-2 rounded-full ${enVivo ? "bg-terminal-green animate-pulse-critical" : "bg-foreground/30"}`}
          />
        </div>
        <div className="px-4 py-3 space-y-1.5 font-mono text-xs">
          <StatRow label="ACTIVAS" value={stats.activas} color="text-terminal-green" />
          <StatRow label="CRÍTICO" value={stats.critico} color="text-hazard-critical" />
          <StatRow label="ALTO" value={stats.alto} color="text-umbrella-red-bright" />
          <StatRow label="MEDIO" value={stats.medio} color="text-biohazard-amber" />
          <StatRow label="BAJO" value={stats.bajo} color="text-terminal-green" />
        </div>
        <div className="px-4 py-3 border-t border-panel-border">
          <p className="text-[10px] font-mono text-foreground/40 mb-2">
            Monitoreo continuo 24/7 · {stats.total} eventos totales
          </p>
          <a
            href="#detalle"
            className="text-[11px] font-mono text-terminal-green hover:text-glow-amber"
          >
            VER DETALLE ↓
          </a>
        </div>
      </div>

      {/* Barra de controles */}
      <div className="absolute right-3 top-3 flex flex-col gap-2">
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.2, 1.8))}
          className="size-9 bg-black/70 border border-panel-border text-foreground/70 hover:text-terminal-green hover:border-terminal-green flex items-center justify-center font-mono"
          aria-label="Acercar"
        >
          +
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.2, 0.7))}
          className="size-9 bg-black/70 border border-panel-border text-foreground/70 hover:text-terminal-green hover:border-terminal-green flex items-center justify-center font-mono"
          aria-label="Alejar"
        >
          −
        </button>
        <button
          onClick={() => setEnVivo((v) => !v)}
          className={`px-2 py-2 text-[10px] font-mono border flex flex-col items-center leading-tight ${
            enVivo
              ? "border-terminal-green text-terminal-green"
              : "border-panel-border text-foreground/50"
          }`}
        >
          <span>EN VIVO</span>
          <span>{enVivo ? "ON" : "OFF"}</span>
        </button>
      </div>
    </div>
  );
}

function StatRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={color}>{label}</span>
      <span className="text-foreground font-bold">{value}</span>
    </div>
  );
}
