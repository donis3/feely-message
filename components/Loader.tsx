import React from "react";
import { FaSpinner } from "react-icons/fa";

export default function Loader({ text }: { text?: string | undefined }) {
	return (
		<div className="mt-10 flex w-full flex-col items-center text-xl">
			<FaSpinner className="animate-spin" />

			<p className="p-2 text-primary/40">
				{text ? text : "Loading latest messages..."}
			</p>
		</div>
	);
}
