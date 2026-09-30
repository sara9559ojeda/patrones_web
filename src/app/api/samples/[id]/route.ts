import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  addAuditEntry,
  listSamples,
  updateSampleEstado,
  type EstadoMuestra,
} from "@/lib/db";

const ESTADOS_VALIDOS: EstadoMuestra[] = [
  "en_analisis",
  "en_cuarentena",
  "contenida",
  "liberada",
];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const sample = listSamples().find((s) => s.id === id);
  if (!sample)
    return NextResponse.json({ error: "Muestra no encontrada" }, { status: 404 });

  const esDueño = sample.investigadorId === session.user.id;
  const esSupervisor =
    session.user.role === "coordinador" || session.user.role === "administrador";
  if (!esDueño && !esSupervisor)
    return NextResponse.json({ error: "Rol sin permiso" }, { status: 403 });

  const body = await req.json();
  const estado = body?.estado as EstadoMuestra | undefined;
  if (!estado || !ESTADOS_VALIDOS.includes(estado))
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });

  const actualizado = updateSampleEstado(id, estado);

  addAuditEntry({
    userId: session.user.id,
    userNombre: session.user.name ?? session.user.email ?? "",
    role: session.user.role,
    accion: "ACTUALIZACION_MUESTRA",
    detalle: `Muestra ${sample.codigo} → estado "${estado}"`,
  });

  return NextResponse.json({ sample: actualizado });
}
