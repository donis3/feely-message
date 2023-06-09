import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { cert } from "firebase-admin/app";

const authOptions: NextAuthOptions = {
	theme: {
		colorScheme: "auto", // "auto" | "dark" | "light"
		brandColor: "#872D5F", // Hex color code
		logo: "/feely-logo.svg", // Absolute URL to image
		buttonText: "#fff", // Hex color code
	},
	// Configure one or more authentication providers
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
	],
	adapter: FirestoreAdapter({
		credential: cert({
			projectId: process.env.FIREBASE_PROJECT_ID,
			clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
			privateKey: process.env.FIREBASE_PRIVATE_KEY,
		}),
	}),
	callbacks: {
		async signIn({ account, profile }) {
			return true; // Do different verification for other providers that don't have `email_verified`
		},

		async session({ session, user }) {
			session.user.uid = user?.id;
			if (user.id === process.env.ADMIN_UID) {
				session.user.admin = true;
			} else {
				session.user.admin = false;
			}
			return session;
		},
	},
	pages: {
		signIn: '/signin'
	}
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
