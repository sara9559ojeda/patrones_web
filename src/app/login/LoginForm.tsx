"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    setPending(false);

    if (!res || res.error) {
      setError("Credenciales inválidas o cuenta no autorizada.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-mono tracking-widest text-foreground/50 mb-1">
          CORREO INSTITUCIONAL
        </label>
        <input
          type="email"
          name="email"
          required
          autoComplete="username"
          className="w-full bg-black/50 border border-panel-border px-3 py-2 font-mono text-sm focus:outline-none focus:border-terminal-green"
          placeholder="usuario@cnbvm.gov.co"
        />
      </div>

      <div>
        <label className="block text-xs font-mono tracking-widest text-foreground/50 mb-1">
          CONTRASEÑA
        </label>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="w-full bg-black/50 border border-panel-border px-3 py-2 font-mono text-sm focus:outline-none focus:border-terminal-green"
          placeholder="••••••••••"
        />
      </div>

      {error && (
        <p className="text-hazard-critical text-xs font-mono border border-hazard-critical bg-hazard-critical/10 px-3 py-2">
          ⚠ {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full py-3 border border-terminal-green text-terminal-green font-mono text-sm tracking-widest hover:bg-terminal-green hover:text-black transition-colors disabled:opacity-40"
      >
        {pending ? "VERIFICANDO ACCESO..." : "INGRESAR"}
      </button>
    </form>
  );
}
