"use client";
import { useState } from "react";
import { BiCheck, BiCopy, BiTrash } from "react-icons/bi";

export default function MessageCopy({ text }: { text: string }) {
	"use client";
	const [copied, setCopied] = useState(false);

	//Disable copy if not needed
	if (text?.length <= 0) {
		return <></>;
	}

	const handleClick = () => {
		try {
			navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => {
				setCopied(false);
			}, 3000);
		} catch (error: any) {
			console.error(error.message);
		}
	};

	return (
		<div className="flex h-full flex-col items-end justify-start ">
			<button type="button" onClick={handleClick}>
				{copied === false ? (
					<BiCopy />
				) : (
					<BiCheck className="text-green-800 dark:text-green-400" />
				)}
			</button>
			{!copied && <span className="h-6"> </span>}
			{copied && (
				<span className="text-sm font-light text-primary/50">
					Message Copied!
				</span>
			)}
		</div>
	);
}
