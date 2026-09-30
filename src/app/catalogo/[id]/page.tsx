import { notFound } from "next/navigation";
import Link from "next/link";
import { getMicroorganism, listMicroorganisms } from "@/lib/db";
import { RiskBadge, riskBorderLeft } from "@/components/RiskBadge";
import { PatternBadge } from "@/components/PatternBadge";

export const revalidate = 30;

export function generateStaticParams() {
  return listMicroorganisms().map((m) => ({ id: m.id }));
}

export default async function MicroorganismoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const microorganismo = getMicroorganism(id);
  if (!microorganismo) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link
        href="/catalogo"
        className="text-xs font-mono text-foreground/50 hover:text-biohazard-amber"
      >
        ← VOLVER AL CATÁLOGO
      </Link>

      <div className="flex items-start justify-between gap-4 mt-4 mb-2">
        <h1 className="font-sans text-3xl font-bold text-biohazard-amber">
          {microorganismo.nombre}
        </h1>
        <RiskBadge grupo={microorganismo.grupoRiesgo} />
      </div>
      <p className="italic text-foreground/50 mb-6">
        {microorganismo.nombreCientifico} · {microorganismo.clasificacion}
      </p>

      <div
        className={`panel-border border-l-4 bg-panel p-6 mb-6 ${riskBorderLeft(microorganismo.grupoRiesgo)}`}
      >
        <p className="text-foreground/70 leading-relaxed">
          {microorganismo.descripcion}
        </p>
        <p className="font-mono text-[11px] text-foreground/30 mt-4">
          Última actualización de ficha: {microorganismo.actualizado}
        </p>
      </div>

      <PatternBadge pattern="ISR" />
    </div>
  );
}
