# CNBVM — Centro Nacional de Bioseguridad y Vigilancia Microbiológica

Plataforma web construida para el taller **"Patrones de Rendering"** de
Programación Orientada a la Web. Implementa los cuatro patrones clásicos de
renderizado (**SSG**, **ISR**, **SSR**, **CSR**) sobre un caso de uso real:
gestión de microorganismos, muestras de laboratorio, investigaciones y
alertas epidemiológicas, con autenticación, autorización por rol y
auditoría.

Next.js (App Router) fue elegido porque es el único framework que soporta
los cuatro patrones de forma nativa en el mismo proyecto, sin necesidad de
herramientas adicionales.

## Mapeo de patrones de rendering

Cada patrón se usa donde tiene sentido, no de forma arbitraria:

| Ruta | Patrón | Por qué |
|---|---|---|
| `/` | **SSG** (`force-static`) | Contenido institucional que no cambia — se genera una vez en build y se sirve desde CDN. |
| `/catalogo` y `/catalogo/[id]` | **ISR** (`revalidate = 30`) | Ficha técnica de referencia que un coordinador actualiza de vez en cuando. Se regenera en segundo plano cada 30s, y además bajo demanda (`revalidatePath`) desde el panel — ver `/api/catalogo/revalidate`. |
| `/alertas` | **SSR** (`force-dynamic`) | Información crítica de salud pública: debe reflejar el estado real en cada solicitud, nunca servirse desde caché vieja. |
| `/dashboard/**` | **CSR** | Panel autenticado y sensible. El servidor no envía datos de negocio en el HTML — solo el contenedor. Todo se pide desde el navegador vía `fetch` a rutas `/api/*` que validan sesión y rol en cada llamada. Evita cachear/prerenderizar contenido restringido. |

## Autenticación, autorización y auditoría

El proyecto es **solo frontend + rutas de servidor de Next.js, sin base de
datos ni backend externo** (requisito explícito del ejercicio). Esto se
resuelve así:

- **Datos**: semillas en `src/data/*.json`, cargadas a un store en memoria
  (`src/lib/db.ts`) que vive mientras el proceso de Node siga activo.
  ⚠️ En un entorno serverless (Vercel) cada instancia fría reinicia desde
  los datos semilla; las mutaciones (nuevas muestras, alertas cerradas,
  etc.) no persisten de forma duradera entre instancias. Es una limitación
  consciente y documentada, aceptable para demostrar el flujo sin
  infraestructura externa.
- **Autenticación**: NextAuth v5 con `Credentials` provider y estrategia
  JWT (sin adapter/BD). Las contraseñas se guardan hasheadas con bcrypt.
- **Autorización**: doble capa —
  1. `src/proxy.ts` (el archivo `middleware`, renombrado a `proxy` en esta
     versión de Next.js) protege `/dashboard/**` a nivel de borde.
  2. Cada ruta `/api/*` vuelve a validar sesión y rol en el servidor
     (`src/lib/rbac.ts`), para que la protección no dependa solo de la UI.
- **Auditoría**: toda acción sensible (inicio de sesión, registro de
  muestra, cambio de estado, revalidación de catálogo) se registra en
  `addAuditEntry` (`src/lib/db.ts`) y es visible en `/dashboard/auditoria`,
  exclusivo para el rol **administrador**.

## Roles y credenciales de demostración

| Rol | Correo | Contraseña | Puede |
|---|---|---|---|
| Investigador | `investigador@cnbvm.gov.co` | `Investigador123!` | Ver y registrar sus propias muestras/investigaciones. |
| Coordinador | `coordinador@cnbvm.gov.co` | `Coordinador123!` | Todo lo anterior + gestionar alertas y actualizar el catálogo público (ISR bajo demanda). |
| Administrador | `admin@cnbvm.gov.co` | `Admin123!` | Todo lo anterior + ver el log de auditoría. |

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # y genera tu propio AUTH_SECRET
npm run dev
```

Generar un `AUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Despliegue en Vercel

1. Sube el repositorio a GitHub.
2. Importa el proyecto en [vercel.com/new](https://vercel.com/new).
3. Define la variable de entorno `AUTH_SECRET` en el dashboard de Vercel
   (Project Settings → Environment Variables).
4. Despliega. ISR, SSR y el proxy/middleware funcionan out-of-the-box en
   la capa gratuita de Vercel.

## Estructura relevante

```
src/
  data/               # "base de datos" semilla (JSON)
  lib/db.ts           # store en memoria + mutaciones
  lib/rbac.ts         # reglas de autorización por rol
  auth.ts             # configuración de NextAuth (Credentials + JWT)
  proxy.ts            # protección de /dashboard/** (antes middleware.ts)
  app/
    page.tsx          # SSG
    catalogo/          # ISR
    alertas/           # SSR
    login/             # acceso
    dashboard/         # CSR (panel autenticado)
    api/               # rutas de servidor consumidas por el panel
```
