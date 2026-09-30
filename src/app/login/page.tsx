import { Biohazard } from "@/components/Biohazard";
import { LoginForm } from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl || "/dashboard";

  return (
    <div className="relative min-h-[75vh] flex items-center justify-center px-4 py-12 overflow-hidden border-b border-panel-border">
      <div className="hazard-stripes h-1.5 w-full absolute top-0 left-0" />
      <div className="absolute inset-0 bg-grid bg-vignette pointer-events-none" />
      <div className="relative w-full max-w-md">
        <div className="flex items-center gap-3 justify-center mb-6">
          <Biohazard className="size-8 text-umbrella-red-bright" />
          <h1 className="font-sans text-xl font-bold tracking-widest">
            ACCESO DE PERSONAL
          </h1>
        </div>

        <div className="panel-border bg-panel/95 backdrop-blur p-8">
          <p className="text-xs font-mono text-foreground/50 mb-6 leading-relaxed">
            Sistema restringido. Todo intento de acceso queda registrado en
            el log de auditoría del CNBVM.
          </p>

          <LoginForm callbackUrl={callbackUrl} />
        </div>

        <div className="mt-6 panel-border border-dashed bg-black/30 p-4 text-[11px] font-mono text-foreground/40 space-y-1">
          <p className="text-biohazard-amber">CREDENCIALES DE DEMOSTRACIÓN</p>
          <p>investigador@cnbvm.gov.co / Investigador123!</p>
          <p>coordinador@cnbvm.gov.co / Coordinador123!</p>
          <p>admin@cnbvm.gov.co / Admin123!</p>
        </div>
      </div>
    </div>
  );
}
