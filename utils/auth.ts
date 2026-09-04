import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "../models/user.model";
import DatabaseConnection from "./config";
import bcrypt from "bcrypt";

export const authOption: NextAuthOptions = {
  providers: [
    // =========================
    // Credentials
    // =========================
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@gmail.com",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email or password are required");
        }

        await DatabaseConnection();

        const user = await User.findOne().where("email", credentials.email);

        if (!user) {
          throw new Error(
            "Your email is not found. Please register first."
          );
        }

        // Google user ko credentials se login nahi karwana
        if (!user.password) {
          throw new Error(
            "This account was created with Google. Please continue with Google."
          );
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Please enter the correct password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.username,
          image: user.image,
        };
      },
    }),

    // =========================
    // Google
    // =========================
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // =========================
    // Google Login
    // =========================
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await DatabaseConnection();

          if (!user.email) {
            return false;
          }

          const existingUser = await User.findOne().where("email", user.email);

          if (existingUser) {
            user.id = existingUser._id.toString();

            return true;
          }

          const newUser = await User.create({
            username:
              user.name ||
              user.email.split("@")[0],

            email: user.email,

            image: user.image || "",

            provider: "google",

            // password Google user ke liye nahi hai
          });

          user.id = newUser._id.toString();

          return true;
        } catch (error) {
          console.error("GOOGLE SIGN IN ERROR:", error);
          return false;
        }
      }

      return true;
    },

    // =========================
    // JWT
    // =========================
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },

    // =========================
    // Session
    // =========================
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.AUTH_SECRET,
};