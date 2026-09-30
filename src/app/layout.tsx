import type { Metadata } from "next";
import { Oswald, Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { AuthProvider } from "@/components/AuthProvider";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-share-tech-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "CNBVM // Centro Nacional de Bioseguridad y Vigilancia Microbiológica",
  description:
    "Plataforma de gestión de microorganismos, muestras, investigaciones y alertas epidemiológicas.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${oswald.variable} ${shareTechMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AuthProvider>
          <div className="scanlines" />
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-panel-border py-6 text-center text-xs font-mono text-foreground/40">
            CNBVM © 2026 — Uso exclusivo de personal autorizado. Todas las
            acciones sensibles quedan registradas.
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
