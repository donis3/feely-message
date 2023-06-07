"use client";
import { FormEvent, ReactNode, Ref, useRef } from "react";
import { Input } from "./ui/input";
import MsgDialog from "./MsgDialog";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function MessageFeed({ children }: { children: ReactNode }) {
	const { data: session, status } = useSession();
	const searchRef = useRef<any>();
	const router = useRouter();
	const onSubmit = (e: FormEvent) => {
		e.preventDefault();
		const searchText = filterSearchInput(searchRef.current?.value);
		if (searchText.length > 0) {
			router.push("/tag/" + searchText);
		} else {
			//Not allowed to search this
			console.log("Illegal search attempt");
		}
	};

	return (
		<section className="mx-auto mt-8 flex w-full max-w-screen-md  flex-col items-center justify-center gap-2 md:mt-16 xl:max-w-screen-xl">
			<form className="mb-8 w-full max-w-xl" action="post" onSubmit={onSubmit}>
				<Input
					type="text"
					placeholder="Search for thanksgiving, christmas, new years..."
					className="border-gray-200 bg-white font-medium shadow-lg dark:border-black dark:bg-gray-900"
					autoComplete="off"
					name="message_search"
					ref={searchRef}
				/>
			</form>

			{/* Only show create msg button if user is logged in */}
			{session && <MsgDialog />}

			{children}
		</section>
	);
}

function filterSearchInput(tag: string | null | undefined) {
	if (!tag) return "";
	//Convert spaces fo single dash
	let filtered = tag.trim().replace(/\s+/g, "-");
	//Filter unwanted
	filtered = filtered.replace(/[^a-zA-Z0-9-_]/g, "");
	return filtered;
}
