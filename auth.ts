import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  pages: { signIn: "/" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") return null;

        const sql = getDb();
        if (!sql) return null;

        const rows = await sql`select email, password_hash from users where email = ${email}`;
        if (rows.length === 0 || !rows[0].password_hash) return null;

        const ok = await bcrypt.compare(password, rows[0].password_hash as string);
        if (!ok) return null;

        return { id: rows[0].email as string, email: rows[0].email as string };
      },
    }),
  ],
});
