import NextAuth, { DefaultSession } from "next-auth";

// I need to augment the default Session interface from next auth to include the user id so I can access it on the server side

declare module "next-auth" {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		user: {
			/** User ID */
			uid: string;
		} & DefaultSession["user"];
	}
}
