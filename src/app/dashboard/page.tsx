import { DashboardOverview } from "./DashboardOverview";

// El servidor no envía ningún dato de negocio en el HTML: solo el
// contenedor. Todo lo sensible se pide desde el navegador vía fetch a
// las rutas /api/*, que validan sesión y rol en cada llamada.
export default function DashboardPage() {
  return <DashboardOverview />;
}
