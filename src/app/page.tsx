import Link from "next/link";
import { Biohazard } from "@/components/Biohazard";
import { PatternBadge } from "@/components/PatternBadge";
import { HeroBand } from "@/components/HeroBand";

// Página completamente estática: no depende de sesión ni de datos que
// cambien con frecuencia. Se genera una vez en build time y se sirve
// desde CDN — ideal para contenido institucional invariable.
export const dynamic = "force-static";

export default function HomePage() {
  return (
    <div>
      <HeroBand>
        <div className="flex items-center gap-4 mb-6">
          <Biohazard className="size-14 text-umbrella-red-bright animate-flicker" />
          <div>
            <h1 className="font-sans text-3xl sm:text-5xl font-bold tracking-wide text-glow-red">
              CENTRO NACIONAL DE BIOSEGURIDAD
            </h1>
            <p className="font-mono text-foreground/60 mt-1 tracking-widest text-sm">
              Y VIGILANCIA MICROBIOLÓGICA — CNBVM
            </p>
          </div>
        </div>

        <p className="max-w-2xl text-foreground/70 leading-relaxed mb-8">
          Coordinamos la vigilancia de microorganismos de interés en salud
          pública, la trazabilidad de muestras de laboratorio y la respuesta
          ante alertas epidemiológicas a nivel nacional. El acceso a
          información operativa está restringido a personal autorizado y
          sujeto a auditoría permanente.
        </p>

        <div className="flex flex-wrap gap-4 mb-10">
          <Link
            href="/catalogo"
            className="px-5 py-3 border border-biohazard-amber text-biohazard-amber font-mono text-sm hover:bg-biohazard-amber hover:text-black transition-colors"
          >
            VER CATÁLOGO PÚBLICO
          </Link>
          <Link
            href="/alertas"
            className="px-5 py-3 border border-umbrella-red-bright text-umbrella-red-bright font-mono text-sm hover:bg-umbrella-red-bright hover:text-black transition-colors"
          >
            VER ALERTAS ACTIVAS
          </Link>
          <Link
            href="/login"
            className="px-5 py-3 border border-panel-border text-foreground/70 font-mono text-sm hover:border-terminal-green hover:text-terminal-green transition-colors"
          >
            ACCESO DE PERSONAL
          </Link>
        </div>

        <PatternBadge pattern="SSG" />
      </HeroBand>

      <section className="bg-panel/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid sm:grid-cols-3 gap-6">
          {[
            {
              titulo: "Niveles de Bioseguridad",
              detalle:
                "Clasificación y manejo de agentes biológicos según grupo de riesgo (BSL-1 a BSL-4).",
            },
            {
              titulo: "Vigilancia Epidemiológica",
              detalle:
                "Monitoreo continuo de brotes y emisión de alertas en tiempo real a la red sanitaria nacional.",
            },
            {
              titulo: "Trazabilidad y Auditoría",
              detalle:
                "Cadena de custodia de muestras y registro inmutable de toda acción sobre información sensible.",
            },
          ].map((item) => (
            <div
              key={item.titulo}
              className="panel-border bg-panel p-6 transition-colors hover:border-biohazard-amber/60"
            >
              <h3 className="font-sans font-semibold text-lg mb-2 text-biohazard-amber">
                {item.titulo}
              </h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                {item.detalle}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
