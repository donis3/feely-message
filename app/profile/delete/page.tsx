"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { wait } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";

export default function DeleteProfile() {
	const [loading, setLoading] = useState(false);
	const { data: session, status } = useSession();
	const router = useRouter();

	/**
	 * Request delete account and log user out
	 * @param uid
	 * @returns
	 */
	async function handleDeleteProfile(uid: string | undefined) {
		if (!uid) return;
		const apiUrl = `/api/user/${uid}`;

		const options: RequestInit = {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		};

		try {
			setLoading(true);
			//await wait(2);

			const response = await fetch(apiUrl, options);

			const result = await response.json();

			if (response.ok) {
				toast({
					title: "Success",
					description: (
						<span className=" font-medium text-green-700">
							Account deleted!
						</span>
					),
				});
				//refresh main page to reload messages
				signOut({ callbackUrl: "/" });
				return;
			} else {
				console.log(result);
				toast({
					variant: "destructive",
					title: "Error",
					description: result.message ?? "Failed to delete account.",
				});
			}
		} catch (error) {
			//Handle err
			toast({
				variant: "destructive",
				title: "Error",
				description: "Something went wrong.",
			});
		} finally {
			setLoading(false);
		}
	}

	if (status === "loading") {
		return "Loading...";
	}
	if (status === "unauthenticated") {
		return "You are not logged in";
	}
	return (
		<section className="mx-auto mt-8 flex w-full max-w-screen-md  flex-col items-center justify-center gap-2 md:mt-16 xl:max-w-screen-xl">
			<h1 className="font-rubik text-2xl font-bold">Delete Account</h1>
			<p className="text-base">
				Are you sure you want to delete your account? Your user data and all
				shared messages will be deleted. This action is irreversible.
			</p>
			<div className="mt-8 flex gap-2">
				<Button
					type="button"
					variant={"outline"}
					onClick={() => router.back()}
					disabled={loading}>
					Cancel
				</Button>
				<Button
					type="button"
					variant={"destructive"}
					onClick={() => handleDeleteProfile(session?.user.uid)}
					disabled={loading}
					className="items-center">
					{loading && <FaSpinner className="mr-1 animate-spin" />}
					Confirm
				</Button>
			</div>
		</section>
	);
}
