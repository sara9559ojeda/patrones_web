"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import type { Alert, Investigation, Sample, Microorganism } from "@/lib/db";
import { ROLE_LABEL } from "@/lib/rbac";

export function DashboardOverview() {
  const { data: session } = useSession();
  const [samples, setSamples] = useState<Sample[] | null>(null);
  const [investigations, setInvestigations] = useState<Investigation[] | null>(
    null
  );
  const [alerts, setAlerts] = useState<Alert[] | null>(null);
  const [microorganismos, setMicroorganismos] = useState<Microorganism[]>([]);
  const [revalidando, setRevalidando] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;
    Promise.all([
      fetch("/api/samples").then((r) => r.json()),
      fetch("/api/investigations").then((r) => r.json()),
      fetch("/api/alerts").then((r) => r.json()),
    ]).then(([s, i, a]) => {
      if (!activo) return;
      setSamples(s.samples ?? []);
      setInvestigations(i.investigations ?? []);
      setAlerts(a.alerts ?? []);
    });
    return () => {
      activo = false;
    };
  }, []);

  useEffect(() => {
    import("@/data/microorganisms.json").then((mod) =>
      setMicroorganismos(mod.default as Microorganism[])
    );
  }, []);

  const role = session?.user?.role;
  const puedeActualizarCatalogo = role === "coordinador" || role === "administrador";

  async function actualizarFicha(id: string, nombre: string) {
    setRevalidando(id);
    setMensaje(null);
    const res = await fetch("/api/catalogo/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ microorganismoId: id }),
    });
    setRevalidando(null);
    if (res.ok) {
      setMensaje(`Ficha "${nombre}" regenerada (ISR bajo demanda). Revisa /catalogo.`);
    } else {
      const data = await res.json().catch(() => ({}));
      setMensaje(data.error ?? "No se pudo regenerar la ficha.");
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-sans text-2xl font-bold text-terminal-green mb-1">
          PANEL — {session?.user?.name?.toUpperCase() ?? "…"}
        </h1>
        <p className="text-xs font-mono text-foreground/50">
          Rol: {role ? ROLE_LABEL[role] : "…"}
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="MUESTRAS VISIBLES" value={samples?.length} />
        <StatCard label="INVESTIGACIONES" value={investigations?.length} />
        <StatCard
          label="ALERTAS ACTIVAS"
          value={alerts?.filter((a) => a.estado === "activa").length}
          alerta
        />
      </div>

      {puedeActualizarCatalogo && (
        <div className="panel-border bg-panel p-5">
          <h2 className="font-sans font-semibold text-biohazard-amber mb-1">
            Actualizar catálogo público (ISR bajo demanda)
          </h2>
          <p className="text-xs text-foreground/50 mb-4">
            Marca una ficha como actualizada y fuerza su regeneración
            inmediata en <code>/catalogo</code>, sin esperar la ventana de
            30s ni reconstruir todo el sitio.
          </p>
          <div className="flex flex-wrap gap-2">
            {microorganismos.map((m) => (
              <button
                key={m.id}
                onClick={() => actualizarFicha(m.id, m.nombre)}
                disabled={revalidando === m.id}
                className="text-xs font-mono border border-biohazard-amber text-biohazard-amber px-3 py-2 hover:bg-biohazard-amber hover:text-black transition-colors disabled:opacity-40"
              >
                {revalidando === m.id ? "REGENERANDO..." : m.nombre}
              </button>
            ))}
          </div>
          {mensaje && (
            <p className="mt-3 text-xs font-mono text-terminal-green">
              {mensaje}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  alerta,
}: {
  label: string;
  value: number | undefined;
  alerta?: boolean;
}) {
  return (
    <div
      className={`panel-border bg-panel p-5 ${
        alerta && value ? "border-hazard-critical" : ""
      }`}
    >
      <div className="text-3xl font-mono font-bold">
        {value === undefined ? "···" : value}
      </div>
      <div className="text-[11px] font-mono text-foreground/50 tracking-widest mt-1">
        {label}
      </div>
    </div>
  );
}
