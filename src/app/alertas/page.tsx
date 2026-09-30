import { listAlerts, getMicroorganism } from "@/lib/db";
import { AlertBadge, alertBorderLeft } from "@/components/AlertBadge";
import { PatternBadge } from "@/components/PatternBadge";
import { LiveMap } from "@/components/LiveMap/LiveMap";
import { HeroBand } from "@/components/HeroBand";

// Las alertas epidemiológicas son información crítica de salud pública:
// nunca deben servirse desde una caché desactualizada. Se fuerza
// renderizado en el servidor en cada solicitud.
export const dynamic = "force-dynamic";

export default function AlertasPage() {
  const alertas = listAlerts();
  const renderizadoEn = new Date().toLocaleString("es-CO", {
    dateStyle: "medium",
    timeStyle: "medium",
  });

  return (
    <div>
      <HeroBand>
        <h1 className="font-sans text-3xl sm:text-4xl font-bold mb-2 text-umbrella-red-bright text-glow-red">
          ALERTAS EPIDEMIOLÓGICAS
        </h1>
        <p className="text-foreground/60 text-sm">
          Estado nacional de alertas activas. Esta vista se genera en tiempo
          real en cada solicitud.
        </p>
      </HeroBand>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 my-10">
        <LiveMap alerts={alertas} />
      </div>

      <div id="detalle" className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
        <div className="mb-8">
          <PatternBadge pattern="SSR" />
          <p className="font-mono text-[11px] text-foreground/40 mt-2">
            Renderizado en el servidor: {renderizadoEn}
          </p>
        </div>

        <div className="space-y-4">
          {alertas.map((alerta) => {
          const microorganismo = getMicroorganism(alerta.microorganismoId);
          return (
            <div
              key={alerta.id}
              className={`panel-border border-l-4 bg-panel p-5 ${alertBorderLeft(alerta.nivel)}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h2 className="font-sans font-semibold text-lg">
                  {alerta.titulo}
                </h2>
                <AlertBadge nivel={alerta.nivel} />
              </div>
              <p className="text-sm text-foreground/60 mb-3">
                {alerta.descripcion}
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-[11px] text-foreground/40">
                <span>REGIÓN: {alerta.region}</span>
                {microorganismo && <span>AGENTE: {microorganismo.nombre}</span>}
                <span>
                  FECHA: {new Date(alerta.fecha).toLocaleString("es-CO")}
                </span>
                <span>
                  ESTADO: {alerta.estado === "activa" ? "ACTIVA" : "CERRADA"}
                </span>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}
