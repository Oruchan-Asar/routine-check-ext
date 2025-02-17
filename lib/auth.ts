import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

const validateCredentials = (
  email?: string,
  password?: string
): { email: string; password: string } => {
  if (!email || !password) {
    throw new AuthError("Email and password are required");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AuthError("Invalid email format");
  }

  if (password.length < 4) {
    throw new AuthError("Password must be at least 4 characters long");
  }

  return { email, password };
};

const authenticateUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AuthError("Invalid credentials");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new AuthError("Invalid credentials");
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = validateCredentials(
            credentials?.email,
            credentials?.password
          );
          return await authenticateUser(email, password);
        } catch (error) {
          if (error instanceof AuthError) {
            throw new Error(error.message);
          }
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
  },
};
