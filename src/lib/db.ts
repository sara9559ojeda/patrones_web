import usersSeed from "@/data/users.json";
import microorganismsSeed from "@/data/microorganisms.json";
import alertsSeed from "@/data/alerts.json";
import samplesSeed from "@/data/samples.json";
import investigationsSeed from "@/data/investigations.json";

export type Role = "investigador" | "coordinador" | "administrador";

export type User = {
  id: string;
  nombre: string;
  email: string;
  passwordHash: string;
  role: Role;
};

export type Microorganism = {
  id: string;
  nombre: string;
  nombreCientifico: string;
  clasificacion: string;
  grupoRiesgo: 1 | 2 | 3 | 4;
  descripcion: string;
  actualizado: string;
};

export type NivelAlerta = "bajo" | "medio" | "alto" | "critico";

export type Alert = {
  id: string;
  titulo: string;
  microorganismoId: string;
  region: string;
  nivel: NivelAlerta;
  fecha: string;
  descripcion: string;
  estado: "activa" | "cerrada";
};

export type EstadoMuestra =
  | "en_analisis"
  | "en_cuarentena"
  | "contenida"
  | "liberada";

export type Sample = {
  id: string;
  codigo: string;
  microorganismoId: string;
  investigadorId: string;
  estado: EstadoMuestra;
  nivelBioseguridad: 1 | 2 | 3 | 4;
  fechaRecoleccion: string;
  ubicacion: string;
};

export type Investigation = {
  id: string;
  titulo: string;
  investigadorResponsable: string;
  estado: "en_curso" | "critica" | "cerrada";
  muestrasRelacionadas: string[];
  resumen: string;
};

export type AuditEntry = {
  id: string;
  timestamp: string;
  userId: string;
  userNombre: string;
  role: Role;
  accion: string;
  detalle: string;
};

/**
 * Almacen en memoria: reemplaza una base de datos real (requisito del
 * proyecto: "solo web, sin backend"). En Vercel (serverless) cada
 * instancia fría parte de estos datos semilla; las mutaciones viven
 * mientras la instancia siga activa. Suficiente para demostrar el flujo
 * de autenticación, autorización y auditoría sin infraestructura externa.
 */
const globalForDb = globalThis as unknown as {
  __cnbvmDb?: {
    users: User[];
    microorganisms: Microorganism[];
    alerts: Alert[];
    samples: Sample[];
    investigations: Investigation[];
    auditLog: AuditEntry[];
  };
};

if (!globalForDb.__cnbvmDb) {
  globalForDb.__cnbvmDb = {
    users: structuredClone(usersSeed) as User[],
    microorganisms: structuredClone(microorganismsSeed) as Microorganism[],
    alerts: structuredClone(alertsSeed) as Alert[],
    samples: structuredClone(samplesSeed) as Sample[],
    investigations: structuredClone(investigationsSeed) as Investigation[],
    auditLog: [],
  };
}

const db = globalForDb.__cnbvmDb;

export function getUserByEmail(email: string): User | undefined {
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserById(id: string): User | undefined {
  return db.users.find((u) => u.id === id);
}

export function listMicroorganisms(): Microorganism[] {
  return db.microorganisms;
}

export function getMicroorganism(id: string): Microorganism | undefined {
  return db.microorganisms.find((m) => m.id === id);
}

export function listAlerts(): Alert[] {
  return [...db.alerts].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
}

export function listSamples(): Sample[] {
  return db.samples;
}

export function listSamplesForUser(userId: string, role: Role): Sample[] {
  if (role === "administrador" || role === "coordinador") return db.samples;
  return db.samples.filter((s) => s.investigadorId === userId);
}

export function addSample(sample: Omit<Sample, "id">): Sample {
  const nuevo: Sample = { ...sample, id: `s-${Date.now()}` };
  db.samples.push(nuevo);
  return nuevo;
}

export function updateSampleEstado(id: string, estado: EstadoMuestra) {
  const sample = db.samples.find((s) => s.id === id);
  if (sample) sample.estado = estado;
  return sample;
}

export function listInvestigations(): Investigation[] {
  return db.investigations;
}

export function listInvestigationsForUser(
  userId: string,
  role: Role
): Investigation[] {
  if (role === "administrador" || role === "coordinador")
    return db.investigations;
  return db.investigations.filter((i) => i.investigadorResponsable === userId);
}

export function updateAlertEstado(id: string, estado: Alert["estado"]) {
  const alert = db.alerts.find((a) => a.id === id);
  if (alert) alert.estado = estado;
  return alert;
}

export function addAuditEntry(entry: Omit<AuditEntry, "id" | "timestamp">) {
  const nuevo: AuditEntry = {
    ...entry,
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
  };
  db.auditLog.unshift(nuevo);
  db.auditLog = db.auditLog.slice(0, 200);
  return nuevo;
}

export function listAuditLog(): AuditEntry[] {
  return db.auditLog;
}
