import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { listInvestigationsForUser } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const investigations = listInvestigationsForUser(
    session.user.id,
    session.user.role
  );
  return NextResponse.json({ investigations });
}
