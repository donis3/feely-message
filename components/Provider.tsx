"use client";

import { SessionProvider } from "next-auth/react";

const Provider = ({ children, session }: any) => (
	<SessionProvider session={session}>{children}</SessionProvider>
);

export default Provider;
