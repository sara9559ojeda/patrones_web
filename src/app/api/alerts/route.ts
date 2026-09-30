import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { addAuditEntry, listAlerts, updateAlertEstado } from "@/lib/db";
import { canManageAlerts } from "@/lib/rbac";

export async function GET() {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  return NextResponse.json({ alerts: listAlerts() });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!canManageAlerts(session.user.role))
    return NextResponse.json({ error: "Rol sin permiso" }, { status: 403 });

  const body = await req.json();
  const { id, estado } = body as { id?: string; estado?: "activa" | "cerrada" };
  if (!id || !estado)
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });

  const actualizada = updateAlertEstado(id, estado);
  if (!actualizada)
    return NextResponse.json({ error: "Alerta no encontrada" }, { status: 404 });

  addAuditEntry({
    userId: session.user.id,
    userNombre: session.user.name ?? session.user.email ?? "",
    role: session.user.role,
    accion: "ACTUALIZACION_ALERTA",
    detalle: `Alerta "${actualizada.titulo}" → ${estado.toUpperCase()}`,
  });

  return NextResponse.json({ alert: actualizada });
}
