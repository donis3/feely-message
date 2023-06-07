import React from "react";

export default function About() {
	return (
		<section className="mx-auto max-w-2xl p-4">
			<h1 className="mt-4 text-xl font-bold">About Feely Message</h1>

			{/* TODO: Create better about text */}
			<p className="mt-5  text-gray-600 dark:text-gray-300 sm:text-xl md:text-lg">
				FeelyMessage is a portfolio app created using next.js 13.4 with app
				router.
			</p>
		</section>
	);
}
