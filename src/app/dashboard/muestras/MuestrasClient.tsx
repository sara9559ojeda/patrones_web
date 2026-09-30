"use client";

import { useEffect, useState, type FormEvent } from "react";
import microorganismosSeed from "@/data/microorganisms.json";
import type { EstadoMuestra, Sample } from "@/lib/db";
import { RiskBadge } from "@/components/RiskBadge";

const ESTADOS: { value: EstadoMuestra; label: string }[] = [
  { value: "en_analisis", label: "En análisis" },
  { value: "en_cuarentena", label: "En cuarentena" },
  { value: "contenida", label: "Contenida" },
  { value: "liberada", label: "Liberada" },
];

export function MuestrasClient() {
  const [samples, setSamples] = useState<Sample[] | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    microorganismoId: microorganismosSeed[0]?.id ?? "",
    ubicacion: "",
    nivelBioseguridad: 2,
  });

  async function cargar() {
    const res = await fetch("/api/samples");
    const data = await res.json();
    setSamples(data.samples ?? []);
  }

  useEffect(() => {
    let activo = true;
    fetch("/api/samples")
      .then((r) => r.json())
      .then((data) => {
        if (activo) setSamples(data.samples ?? []);
      });
    return () => {
      activo = false;
    };
  }, []);

  async function registrarMuestra(e: FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError(null);
    const res = await fetch("/api/samples", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setCargando(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "No se pudo registrar la muestra.");
      return;
    }
    setForm({ ...form, ubicacion: "" });
    cargar();
  }

  async function cambiarEstado(id: string, estado: EstadoMuestra) {
    await fetch(`/api/samples/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    });
    cargar();
  }

  function nombreMicroorganismo(id: string) {
    return microorganismosSeed.find((m) => m.id === id)?.nombre ?? id;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-sans text-2xl font-bold text-terminal-green mb-1">
          MUESTRAS DE LABORATORIO
        </h1>
        <p className="text-xs font-mono text-foreground/50">
          Datos obtenidos vía fetch desde el navegador tras montar el
          componente — nada de esto llega pre-renderizado en el HTML.
        </p>
      </div>

      <form
        onSubmit={registrarMuestra}
        className="panel-border bg-panel p-5 grid sm:grid-cols-[1fr_1fr_120px_auto] gap-3 items-end"
      >
        <div>
          <label className="block text-[11px] font-mono text-foreground/50 mb-1">
            MICROORGANISMO
          </label>
          <select
            value={form.microorganismoId}
            onChange={(e) =>
              setForm({ ...form, microorganismoId: e.target.value })
            }
            className="w-full bg-black/50 border border-panel-border px-2 py-2 text-sm font-mono"
          >
            {microorganismosSeed.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-mono text-foreground/50 mb-1">
            UBICACIÓN
          </label>
          <input
            required
            value={form.ubicacion}
            onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
            placeholder="Laboratorio Central..."
            className="w-full bg-black/50 border border-panel-border px-2 py-2 text-sm font-mono"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono text-foreground/50 mb-1">
            BSL
          </label>
          <select
            value={form.nivelBioseguridad}
            onChange={(e) =>
              setForm({ ...form, nivelBioseguridad: Number(e.target.value) })
            }
            className="w-full bg-black/50 border border-panel-border px-2 py-2 text-sm font-mono"
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                BSL-{n}
              </option>
            ))}
          </select>
        </div>
        <button
          disabled={cargando}
          className="py-2 px-4 border border-terminal-green text-terminal-green font-mono text-xs hover:bg-terminal-green hover:text-black transition-colors disabled:opacity-40"
        >
          {cargando ? "REGISTRANDO..." : "REGISTRAR MUESTRA"}
        </button>
        {error && (
          <p className="sm:col-span-4 text-hazard-critical text-xs font-mono">
            ⚠ {error}
          </p>
        )}
      </form>

      <div className="overflow-x-auto panel-border">
        <table className="w-full text-sm font-mono">
          <thead className="bg-panel text-foreground/50 text-[11px] tracking-widest">
            <tr>
              <th className="text-left px-3 py-2">CÓDIGO</th>
              <th className="text-left px-3 py-2">AGENTE</th>
              <th className="text-left px-3 py-2">BSL</th>
              <th className="text-left px-3 py-2">UBICACIÓN</th>
              <th className="text-left px-3 py-2">ESTADO</th>
            </tr>
          </thead>
          <tbody>
            {samples === null && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-foreground/40">
                  Cargando…
                </td>
              </tr>
            )}
            {samples?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-foreground/40">
                  Sin muestras registradas todavía.
                </td>
              </tr>
            )}
            {samples?.map((s) => (
              <tr key={s.id} className="border-t border-panel-border">
                <td className="px-3 py-2">{s.codigo}</td>
                <td className="px-3 py-2">{nombreMicroorganismo(s.microorganismoId)}</td>
                <td className="px-3 py-2">
                  <RiskBadge grupo={s.nivelBioseguridad} />
                </td>
                <td className="px-3 py-2 text-foreground/60">{s.ubicacion}</td>
                <td className="px-3 py-2">
                  <select
                    value={s.estado}
                    onChange={(e) =>
                      cambiarEstado(s.id, e.target.value as EstadoMuestra)
                    }
                    className="bg-black/50 border border-panel-border px-2 py-1 text-xs"
                  >
                    {ESTADOS.map((e) => (
                      <option key={e.value} value={e.value}>
                        {e.label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
