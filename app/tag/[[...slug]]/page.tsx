import Feed from "@/components/Feed";
import Loader from "@/components/Loader";
import MessageFeed from "@/components/MessageFeed";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { Suspense } from "react";
import { BiArrowBack } from "react-icons/bi";

type TagProps = {
	params: { slug: string[] };
	searchParams: any;
};

export default function Tag({ params, searchParams }: TagProps) {
	const tag = params.slug?.length > 0 ? params.slug[0] : "";

	return (
		<section className="flex flex-col items-center justify-start">
			<div className="w-full">
				<Link href={"/"}>
					<Button variant={"ghost"} className="gap-1 text-base">
						<BiArrowBack /> Back
					</Button>{" "}
				</Link>
			</div>
			<h1 className="mt-5 text-center font-sans text-2xl font-bold leading-[1.15]  text-black dark:text-gray-300 md:text-3xl">
				{tag.length > 0 ? "#" + tag.toUpperCase() : "ALL MESSAGES"}
			</h1>

			<p className="mt-2 max-w-2xl px-4 text-gray-600 dark:text-gray-300 sm:text-xl md:text-lg">
				Here are the latest messages for this occasion!
			</p>

			<div className="mx-auto mt-8 flex w-full max-w-screen-md  flex-col items-center justify-center gap-2 md:mt-16 xl:max-w-screen-xl">
				<Suspense fallback={<Loader />}>
					{/* @ts-expect-error Async Server Component */}
					<Feed params={{ ...searchParams, tag }} />
				</Suspense>
			</div>
		</section>
	);
}
