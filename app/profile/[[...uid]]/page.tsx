import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Feed from "@/components/Feed";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";

import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import { FaTrash } from "react-icons/fa";

type Props = {
	params: { uid?: string[] };
	searchParams: any;
};
type UserData = {
	name: string;
	email: string;
	image: string | undefined;
	messageCount: number | undefined;
} | null;

const getUserData = async (uid: string) => {
	// Users api url
	const apiUrl = new URL(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/user/${uid}`);
	const response = await fetch(apiUrl, { next: { revalidate: 600 } }); // Cache for 10 minutes (user info)
	if (!response.ok) throw new Error("Unable to find user data");

	const data = await response.json();

	const result: UserData = {
		name: data?.name ?? "",
		email: data?.email ?? "",
		image: data?.image ?? null,
		messageCount: data?.messageCount ?? 0,
	};
	return result;
};

export default async function ProfilePage({ params, searchParams }: Props) {
	//Get requested user id from url. If no uid specified, assume its users own profile
	let userId = params?.uid && params.uid.length > 0 ? params.uid[0] : null;

	let session;
	let userData: UserData = null;
	if (!userId) {
		session = await getServerSession(authOptions);
		if (session && session?.user) {
			userId = session.user.uid;
		} else {
			return notFound();
		}
	}

	try {
		userData = await getUserData(userId);
	} catch (error) {
		return notFound();
	}

	return (
		<section className="mx-auto mt-8 flex w-full max-w-screen-md  flex-col items-center justify-center gap-2 md:mt-16 xl:max-w-screen-xl">
			<div className="w-full">
				<h1 className="font-rubik text-2xl font-bold">
					{session ? "Your Profile" : "Public Profile"}
				</h1>
				<p className="hidden text-sm font-light md:block">
					{!session
						? "Displaying user's public profile"
						: "Displaying your private profile page. You can edit or delete your messages. Your email address is not shown to the public"}
				</p>
			</div>

			<div className="flex w-full flex-col gap-4 md:flex-row">
				<div className="w-full md:mt-4 md:h-fit md:w-4/12">
					<Profile userData={userData} />
					{session && (
						<div className="mt-8  hidden w-full justify-center md:flex">
							<DeleteButton />
						</div>
					)}
				</div>
				<div className="min-h-[200px] w-full md:w-8/12">
					<Suspense fallback={<Loader text="Loading user's collection" />}>
						{/* @ts-expect-error Async server component */}
						<Feed
							params={{ ...searchParams, author: userId ?? session?.user.uid }}
							showControls={session ? true : false}
						/>
					</Suspense>
					{session && (
						<div className="mb-4 mt-16  flex w-full justify-center md:hidden">
							<DeleteButton />
						</div>
					)}
				</div>
			</div>
		</section>
	);
}

function Profile({ userData }: { userData: UserData }) {
	if (!userData) return <></>;

	return (
		<Card className="w-full">
			<CardContent className="p-3 text-center">
				{userData.image && (
					<div className="mb-2 flex w-full justify-center">
						<Image
							src={userData.image}
							alt="User Image"
							width={100}
							height={100}
							className="aspect-square w-32 rounded-full"
						/>
					</div>
				)}
				<h3 className="text-lg font-bold">{userData.name}</h3>
				<p className="text-base font-normal">{userData.email}</p>
				<div className="mt-4 flex w-full items-center justify-center gap-2 border-t p-2 text-sm font-light">
					Shared <span className="font-medium">{userData.messageCount}</span>{" "}
					messages
				</div>
			</CardContent>
		</Card>
	);
}

function DeleteButton({ className }: { className?: string }) {
	return (
		<Link href={"/profile/delete"}>
			<Button variant={"outline"} className="gap-1 text-sm text-red-700 dark:bg-secondary">
				<FaTrash /> Delete Profile
			</Button>
		</Link>
	);
}
