import Feed from "@/components/Feed";
import Loader from "@/components/Loader";
import MessageFeed from "@/components/MessageFeed";
import { Suspense } from "react";

export default function Home({ searchParams }: any) {
	return (
		<section className="flex flex-col items-center justify-start">
			<h1 className="mt-5 text-center font-sans text-3xl font-extrabold leading-[1.15]  text-black dark:text-gray-300 md:text-4xl">
				Browse & Share
				<br />
				<span className="bg-gradient-to-r from-indigo-800 via-purple-500 to-pink-500 bg-clip-text text-4xl text-transparent md:text-5xl">
					Messages for Any Occasion
				</span>
			</h1>

			<p className="mt-5 max-w-2xl px-4 text-gray-600 dark:text-gray-300 sm:text-xl md:text-lg">
				Looking for a lovely message for a special occasion? Do you want to
				share your latest valentines day message with the world? You're at the
				right place!
			</p>

			<MessageFeed>
				<Suspense fallback={<Loader />}>
					{/* @ts-expect-error Async Server Component */}
					<Feed params={searchParams} />
				</Suspense>
			</MessageFeed>
		</section>
	);
}
