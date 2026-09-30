"use client";

import { useEffect, useState } from "react";
import type { AuditEntry } from "@/lib/db";

export function AuditoriaClient() {
  const [log, setLog] = useState<AuditEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/audit")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error ?? "Error");
        setLog(data.log ?? []);
      })
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-2xl font-bold text-hazard-critical mb-1">
          LOG DE AUDITORÍA
        </h1>
        <p className="text-xs font-mono text-foreground/50">
          Visible únicamente para el rol Administrador. La API valida el
          rol en el servidor en cada solicitud, no solo en la interfaz.
        </p>
      </div>

      {error && (
        <p className="text-hazard-critical text-sm font-mono border border-hazard-critical p-3">
          ⚠ {error}
        </p>
      )}

      <div className="overflow-x-auto panel-border">
        <table className="w-full text-xs font-mono">
          <thead className="bg-panel text-foreground/50 tracking-widest">
            <tr>
              <th className="text-left px-3 py-2">FECHA</th>
              <th className="text-left px-3 py-2">USUARIO</th>
              <th className="text-left px-3 py-2">ROL</th>
              <th className="text-left px-3 py-2">ACCIÓN</th>
              <th className="text-left px-3 py-2">DETALLE</th>
            </tr>
          </thead>
          <tbody>
            {log === null && !error && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-foreground/40">
                  Cargando…
                </td>
              </tr>
            )}
            {log?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-foreground/40">
                  Sin eventos registrados todavía.
                </td>
              </tr>
            )}
            {log?.map((entry) => (
              <tr key={entry.id} className="border-t border-panel-border">
                <td className="px-3 py-2 text-foreground/50">
                  {new Date(entry.timestamp).toLocaleString("es-CO")}
                </td>
                <td className="px-3 py-2">{entry.userNombre}</td>
                <td className="px-3 py-2 uppercase text-biohazard-amber">
                  {entry.role}
                </td>
                <td className="px-3 py-2 text-terminal-green">{entry.accion}</td>
                <td className="px-3 py-2 text-foreground/60">{entry.detalle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
