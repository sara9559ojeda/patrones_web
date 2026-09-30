import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { canViewAudit } from "@/lib/rbac";
import { PatternBadge } from "@/components/PatternBadge";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // El middleware ya protege /dashboard/**; esto es una segunda barrera
  // por si el layout se renderizara sin haber pasado por él.
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-6">
          <PatternBadge pattern="CSR" />
        </div>

        <div className="grid md:grid-cols-[200px_1fr] gap-8">
          <aside className="space-y-1 font-mono text-xs tracking-wide">
            <Link
              href="/dashboard"
              className="block px-3 py-2 border border-transparent hover:border-panel-border hover:bg-panel"
            >
              RESUMEN
            </Link>
            <Link
              href="/dashboard/muestras"
              className="block px-3 py-2 border border-transparent hover:border-panel-border hover:bg-panel"
            >
              MUESTRAS
            </Link>
            <Link
              href="/dashboard/investigaciones"
              className="block px-3 py-2 border border-transparent hover:border-panel-border hover:bg-panel"
            >
              INVESTIGACIONES
            </Link>
            <Link
              href="/dashboard/alertas"
              className="block px-3 py-2 border border-transparent hover:border-panel-border hover:bg-panel"
            >
              GESTIÓN DE ALERTAS
            </Link>
            {canViewAudit(session.user.role) && (
              <Link
                href="/dashboard/auditoria"
                className="block px-3 py-2 border border-transparent hover:border-hazard-critical hover:bg-panel text-hazard-critical"
              >
                AUDITORÍA
              </Link>
            )}
          </aside>

          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </>
  );
}
