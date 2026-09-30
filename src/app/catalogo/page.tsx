import Link from "next/link";
import { listMicroorganisms } from "@/lib/db";
import { RiskBadge, riskHoverBorder, riskHoverText } from "@/components/RiskBadge";
import { PatternBadge } from "@/components/PatternBadge";
import { HeroBand } from "@/components/HeroBand";

// El catálogo público cambia con poca frecuencia (un coordinador actualiza
// una ficha de vez en cuando), pero no puede depender de un rebuild manual.
// ISR regenera esta página en segundo plano cada 30s como máximo, y además
// puede regenerarse bajo demanda (revalidatePath) cuando el dashboard
// registra una actualización — ver /api/catalogo/revalidate.
export const revalidate = 30;

export default function CatalogoPage() {
  const microorganismos = listMicroorganisms();
  const generadoEn = new Date().toISOString();

  return (
    <div>
      <HeroBand>
        <h1 className="font-sans text-3xl sm:text-4xl font-bold mb-2 text-biohazard-amber">
          CATÁLOGO DE MICROORGANISMOS
        </h1>
        <p className="text-foreground/60 text-sm mb-4">
          Ficha técnica de referencia de agentes bajo vigilancia. Actualizada
          periódicamente por el equipo de coordinación.
        </p>
        <div>
          <PatternBadge pattern="ISR" />
          <p className="font-mono text-[11px] text-foreground/40 mt-2">
            Página generada: {generadoEn} · próxima regeneración en ≤30s
          </p>
        </div>
      </HeroBand>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {microorganismos.map((m) => (
            <Link
              key={m.id}
              href={`/catalogo/${m.id}`}
              className={`panel-border bg-panel p-5 transition-colors group ${riskHoverBorder(m.grupoRiesgo)}`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <h2
                  className={`font-sans font-semibold text-lg transition-colors ${riskHoverText(m.grupoRiesgo)}`}
                >
                  {m.nombre}
                </h2>
                <RiskBadge grupo={m.grupoRiesgo} />
              </div>
              <p className="text-xs italic text-foreground/50 mb-2">
                {m.nombreCientifico}
              </p>
              <p className="text-sm text-foreground/60 line-clamp-3">
                {m.descripcion}
              </p>
              <p className="font-mono text-[10px] text-foreground/30 mt-3">
                Actualizado: {m.actualizado}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
