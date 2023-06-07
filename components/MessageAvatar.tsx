"use client";

import React from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Image from "next/image";
import Author from "@/types/Author";
import Link from "next/link";

export default function MessageAvatar({
	author,
	uid,
}: {
	author: Author;
	uid?: string;
}) {
	const colors = ["#d0fffe", "#fffddb", "#e4ffde", "#ffd3fd", "#ffe7d3"];
	const avatarColor = colors[Math.floor(Math.random() * colors.length)];
	return (
		<Link href={`/profile/${uid}`}>
			<Avatar className="h-10 w-10">
				{author.picture && (
					<Image
						alt={`Author's profile picture`}
						src={author.picture}
						width={40}
						height={40}
						onError={(e: any) => {
							//Failed to load image, remove from dom
							if (e.target) e.target.style.display = "none";
						}}
						referrerPolicy="no-referrer"
					/>
				)}
				<AvatarFallback
					style={{ background: avatarColor }}
					suppressHydrationWarning={true}>
					{extractFirstTwoInitials(author.name)}
				</AvatarFallback>
			</Avatar>
		</Link>
	);
}

/**
 * Extracts the initials for the first two words in a name.
 * @param {string} name - The name string.
 * @returns {string} - The initials of the first two words.
 */
function extractFirstTwoInitials(name: string | null | undefined) {
	if (!name) return "";
	// Split the name into an array of words
	const words = name.split(" ");

	// Extract the first letter of each word for the first two words
	const initials = words.slice(0, 2).map((word) => word.charAt(0));

	// Join the initials into a string and return
	return initials.join("");
}
