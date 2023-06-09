import Link from "next/link";
import React from "react";
import { FaHeart } from "react-icons/fa";

export default function Footer() {
	return (
		<footer className="w-full bg-slate-800 bg-opacity-25 shadow-md dark:bg-opacity-75">
			<div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4 text-sm">
				<p className="">&copy;2023 Feely Message</p>

				<p className="flex items-center gap-2">
					Made with <FaHeart className="text-red-700" /> by
					<Link
						target="_blank"
						href={process.env.NEXT_PUBLIC_AUTHOR_GITHUB ?? "/"}
						className="font-medium text-blue-800">
						Deniz Özkan
					</Link>
				</p>
			</div>
		</footer>
	);
}
