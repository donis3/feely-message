import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getProviders } from "next-auth/react";
import ProviderButton from "./ProviderButton";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

type Params = {
	callbackUrl: string | undefined;
	error: string | undefined;
};

export default async function Signin({
	searchParams,
}: {
	searchParams: Params;
}) {
	//If session already exists, redirect home
	const session = await getServerSession(authOptions);
	if (session) return redirect("/");

	//Extract the error if provided
	const { error } = searchParams;

	//Get auth providers
	const providers = await getAuthProviders();

	//No auth providers
	if (!providers) {
		return (
			<div>
				There are no sign in options available at the moment. Please contact us
				if you think this is an error.
			</div>
		);
	}

	//Show sign in options
	return (
		<Card className="w-full md:w-2/3 lg:w-1/2">
			<CardHeader>
				<CardTitle>Login/Create Account</CardTitle>
				<CardDescription>
					When you create an account, you agree to our{" "}
					<Link href={"/tos"} className="font-bold text-blue-800">
						terms of service.
					</Link>{" "}
					You will have to option to delete your account at anytime which
					deletes all personal data and anything you've shared on our app.
				</CardDescription>
			</CardHeader>
			<CardContent className="mt-4 flex flex-col items-center gap-4">
				{error && (
					<p className="mb-2 text-center text-sm font-medium text-red-600">
						Login failed due to an error. <br /> [ERR: {error}]
					</p>
				)}
				{Object.values(providers).map((provider) => (
					<ProviderButton
						name={provider.name}
						id={provider.id}
						key={provider.name}
					/>
				))}
			</CardContent>
		</Card>
	);
}

//Get auth providers via auth api
async function getAuthProviders() {
	try {
		const providers = await getProviders();

		return providers;
	} catch (error) {
		console.log(error);
		return null;
	}
}
