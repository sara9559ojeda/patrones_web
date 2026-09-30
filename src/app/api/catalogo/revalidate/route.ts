import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { addAuditEntry, getMicroorganism } from "@/lib/db";
import { canUpdateCatalog } from "@/lib/rbac";

// Demuestra ISR bajo demanda: en vez de esperar la ventana de
// revalidación automática (30s), un coordinador puede forzar la
// regeneración de la ficha pública justo después de actualizarla.
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!canUpdateCatalog(session.user.role))
    return NextResponse.json({ error: "Rol sin permiso" }, { status: 403 });

  const body = await req.json();
  const microorganismoId = body?.microorganismoId as string | undefined;
  if (!microorganismoId)
    return NextResponse.json({ error: "Falta microorganismoId" }, { status: 400 });

  const microorganismo = getMicroorganism(microorganismoId);
  if (!microorganismo)
    return NextResponse.json({ error: "Microorganismo inválido" }, { status: 404 });

  microorganismo.actualizado = new Date().toISOString().slice(0, 10);

  revalidatePath("/catalogo");
  revalidatePath(`/catalogo/${microorganismoId}`);

  addAuditEntry({
    userId: session.user.id,
    userNombre: session.user.name ?? session.user.email ?? "",
    role: session.user.role,
    accion: "REVALIDACION_CATALOGO",
    detalle: `Ficha "${microorganismo.nombre}" marcada como actualizada y regenerada (ISR bajo demanda)`,
  });

  return NextResponse.json({ microorganismo });
}
