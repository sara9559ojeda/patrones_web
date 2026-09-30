"use client";

import { useEffect, useState } from "react";
import type { Investigation } from "@/lib/db";

const ESTADO_STYLE: Record<Investigation["estado"], string> = {
  en_curso: "border-terminal-green text-terminal-green",
  critica: "border-hazard-critical text-hazard-critical animate-pulse-critical",
  cerrada: "border-panel-border text-foreground/40",
};

export function InvestigacionesClient() {
  const [investigaciones, setInvestigaciones] = useState<Investigation[] | null>(
    null
  );

  useEffect(() => {
    fetch("/api/investigations")
      .then((r) => r.json())
      .then((data) => setInvestigaciones(data.investigations ?? []));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-2xl font-bold text-terminal-green mb-1">
          INVESTIGACIONES
        </h1>
        <p className="text-xs font-mono text-foreground/50">
          Proyectos visibles según tu rol — investigadores ven solo los
          propios, coordinación y administración ven todos.
        </p>
      </div>

      <div className="space-y-3">
        {investigaciones === null && (
          <p className="text-foreground/40 font-mono text-sm">Cargando…</p>
        )}
        {investigaciones?.map((i) => (
          <div key={i.id} className="panel-border bg-panel p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h2 className="font-sans font-semibold">{i.titulo}</h2>
              <span
                className={`text-[10px] font-mono px-2 py-1 border uppercase ${ESTADO_STYLE[i.estado]}`}
              >
                {i.estado.replace("_", " ")}
              </span>
            </div>
            <p className="text-sm text-foreground/60">{i.resumen}</p>
            <p className="font-mono text-[11px] text-foreground/30 mt-2">
              Muestras asociadas: {i.muestrasRelacionadas.join(", ") || "—"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
