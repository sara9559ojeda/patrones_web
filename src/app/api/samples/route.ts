import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  addAuditEntry,
  addSample,
  getMicroorganism,
  listSamplesForUser,
  type EstadoMuestra,
} from "@/lib/db";
import { canRegisterSample } from "@/lib/rbac";

export async function GET() {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const samples = listSamplesForUser(session.user.id, session.user.role);
  return NextResponse.json({ samples });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!canRegisterSample(session.user.role))
    return NextResponse.json({ error: "Rol sin permiso" }, { status: 403 });

  const body = await req.json();
  const { microorganismoId, ubicacion, nivelBioseguridad } = body as {
    microorganismoId?: string;
    ubicacion?: string;
    nivelBioseguridad?: number;
  };

  if (!microorganismoId || !ubicacion || !nivelBioseguridad) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const microorganismo = getMicroorganism(microorganismoId);
  if (!microorganismo)
    return NextResponse.json(
      { error: "Microorganismo inválido" },
      { status: 400 }
    );

  const codigo = `BSL${nivelBioseguridad}-${new Date().getFullYear()}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;

  const nuevaMuestra = addSample({
    codigo,
    microorganismoId,
    investigadorId: session.user.id,
    estado: "en_analisis" as EstadoMuestra,
    nivelBioseguridad: nivelBioseguridad as 1 | 2 | 3 | 4,
    fechaRecoleccion: new Date().toISOString().slice(0, 10),
    ubicacion,
  });

  addAuditEntry({
    userId: session.user.id,
    userNombre: session.user.name ?? session.user.email ?? "",
    role: session.user.role,
    accion: "REGISTRO_MUESTRA",
    detalle: `Muestra ${nuevaMuestra.codigo} registrada — ${microorganismo.nombre}`,
  });

  return NextResponse.json({ sample: nuevaMuestra }, { status: 201 });
}
