"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import type { Alert } from "@/lib/db";
import { AlertBadge } from "@/components/AlertBadge";

export function GestionAlertasClient() {
  const { data: session } = useSession();
  const [alerts, setAlerts] = useState<Alert[] | null>(null);
  const puedeGestionar =
    session?.user?.role === "coordinador" || session?.user?.role === "administrador";

  async function cargar() {
    const res = await fetch("/api/alerts");
    const data = await res.json();
    setAlerts(data.alerts ?? []);
  }

  useEffect(() => {
    let activo = true;
    fetch("/api/alerts")
      .then((r) => r.json())
      .then((data) => {
        if (activo) setAlerts(data.alerts ?? []);
      });
    return () => {
      activo = false;
    };
  }, []);

  async function toggleEstado(alert: Alert) {
    const nuevoEstado = alert.estado === "activa" ? "cerrada" : "activa";
    await fetch("/api/alerts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: alert.id, estado: nuevoEstado }),
    });
    cargar();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-2xl font-bold text-terminal-green mb-1">
          GESTIÓN DE ALERTAS
        </h1>
        <p className="text-xs font-mono text-foreground/50">
          La vista pública en <code>/alertas</code> se sirve por SSR; aquí
          coordinación y administración pueden cerrar o reabrir una alerta.
        </p>
      </div>

      <div className="space-y-3">
        {alerts === null && (
          <p className="text-foreground/40 font-mono text-sm">Cargando…</p>
        )}
        {alerts?.map((a) => (
          <div key={a.id} className="panel-border bg-panel p-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-sans font-semibold">{a.titulo}</h2>
                <AlertBadge nivel={a.nivel} />
              </div>
              <p className="text-xs text-foreground/50">{a.region} · {a.estado.toUpperCase()}</p>
            </div>
            {puedeGestionar && (
              <button
                onClick={() => toggleEstado(a)}
                className="text-xs font-mono border border-panel-border px-3 py-2 hover:border-terminal-green hover:text-terminal-green transition-colors"
              >
                {a.estado === "activa" ? "CERRAR ALERTA" : "REABRIR ALERTA"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
