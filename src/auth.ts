import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { addAuditEntry, getUserByEmail } from "@/lib/db";
import type { Role } from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      name: "Credenciales",
      credentials: {
        email: { label: "Correo institucional", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = getUserByEmail(email);
        if (!user) return null;

        const valido = await bcrypt.compare(password, user.passwordHash);
        if (!valido) return null;

        addAuditEntry({
          userId: user.id,
          userNombre: user.nombre,
          role: user.role,
          accion: "INICIO_SESION",
          detalle: `Acceso concedido a ${user.email}`,
        });

        return {
          id: user.id,
          name: user.nombre,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: Role }).role;
        token.id = user.id as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as Role;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
