import type { Role } from "@/lib/db";

export const ROLE_LABEL: Record<Role, string> = {
  investigador: "Investigador",
  coordinador: "Coordinador",
  administrador: "Administrador",
};

export function canViewAudit(role: Role): boolean {
  return role === "administrador";
}

export function canManageAlerts(role: Role): boolean {
  return role === "coordinador" || role === "administrador";
}

export function canRegisterSample(role: Role): boolean {
  return role === "investigador" || role === "coordinador" || role === "administrador";
}

export function canUpdateCatalog(role: Role): boolean {
  return role === "coordinador" || role === "administrador";
}
