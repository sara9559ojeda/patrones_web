"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Biohazard } from "@/components/Biohazard";
import { ROLE_LABEL } from "@/lib/rbac";

export function SiteHeader() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b border-panel-border bg-panel/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <Biohazard className="size-7 text-umbrella-red-bright group-hover:animate-flicker" />
          <div className="leading-tight">
            <div className="font-bold tracking-wider text-sm sm:text-base text-foreground">
              CNBVM
            </div>
            <div className="text-[10px] sm:text-xs text-foreground/50 font-mono">
              BIOSEGURIDAD // VIGILANCIA
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-mono tracking-wide">
          <Link href="/" className="hover:text-umbrella-red-bright transition-colors">
            INICIO
          </Link>
          <Link href="/catalogo" className="hover:text-biohazard-amber transition-colors">
            CATÁLOGO
          </Link>
          <Link href="/alertas" className="hover:text-hazard-critical transition-colors">
            ALERTAS
          </Link>
          {session?.user && (
            <Link href="/dashboard" className="hover:text-terminal-green transition-colors">
              PANEL
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {status === "authenticated" && session.user ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs text-foreground/60 font-mono">
                  {ROLE_LABEL[session.user.role]}
                </div>
                <div className="text-sm font-bold">{session.user.name}</div>
              </div>
              <button
                onClick={() => signOut({ redirectTo: "/" })}
                className="text-xs font-mono border border-panel-border px-3 py-2 hover:border-umbrella-red-bright hover:text-umbrella-red-bright transition-colors"
              >
                SALIR
              </button>
            </div>
          ) : status === "unauthenticated" ? (
            <Link
              href="/login"
              className="text-xs font-mono border border-umbrella-red-bright text-umbrella-red-bright px-3 py-2 hover:bg-umbrella-red-bright hover:text-black transition-colors"
            >
              ACCESO RESTRINGIDO
            </Link>
          ) : (
            <div className="w-[132px] h-[34px]" />
          )}
        </div>
      </div>
    </header>
  );
}
