import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { listAuditLog } from "@/lib/db";
import { canViewAudit } from "@/lib/rbac";

export async function GET() {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!canViewAudit(session.user.role))
    return NextResponse.json({ error: "Rol sin permiso" }, { status: 403 });

  return NextResponse.json({ log: listAuditLog() });
}
