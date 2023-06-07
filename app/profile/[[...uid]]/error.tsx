"use client"; // Error components must be Client Components

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";
import { FaHome } from "react-icons/fa";

export default function Error({
	error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	return (
		<section className="mx-auto mt-8 flex w-full max-w-screen-md  flex-col items-center justify-center gap-2 md:mt-16 xl:max-w-screen-xl">
			<h1 className="font-rubik text-2xl font-bold">User Not Found</h1>
			<p className="p-4 text-sm font-light">
				Couldn't find the requested user data. Please try again.
			</p>
			<div className="p-4">
				<Link href={"/"} className="flex items-center gap-2">
					<Button className="gap-1">
						<FaHome /> Home
					</Button>
				</Link>
			</div>
		</section>
	);
}
