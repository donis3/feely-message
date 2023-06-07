import { Message } from "@/types/Forms";
import { notFound } from "next/navigation";
import React from "react";
import EditForm from "./EditForm";

type Props = {
	params: { msgId?: string[] };
};

export default async function EditMessage({ params }: Props) {
	const msgId = params?.msgId ? params.msgId[0] : undefined;
	const message: Message = await getData(msgId);
	if (!message || !msgId) return notFound();

	return (
		<section className="mx-auto mt-8 flex w-full max-w-screen-md  flex-col items-center justify-center gap-2 md:mt-16 xl:max-w-screen-xl">
			<EditForm message={message} />
		</section>
	);
}

/**
 * Get message data from backend
 * @param msgId id for message
 * @returns
 */
async function getData(msgId: string | undefined) {
	if (!msgId) return null;
	// Create the target url object with search params and pagination
	const apiUrl = new URL(
		`${process.env.NEXT_PUBLIC_HOSTNAME}/api/messages/${msgId}`,
	);

	try {
		const res = await fetch(apiUrl, { next: { tags: ["messages"] } });
		//await wait(3);

		if (!res.ok) {
			// This will activate the closest `error.js` Error Boundary
			throw new Error("Failed to fetch data");
		}

		return res.json();
	} catch (error: any) {
		//Failed to fetch messages
		console.log(error?.message);
		return null;
	}
}
