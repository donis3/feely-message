"use client";
import { useSession } from "next-auth/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { BiTrash } from "react-icons/bi";
import { toast } from "./ui/use-toast";
import { FaSpinner } from "react-icons/fa";

/**
 * Quick msg delete button for admins
 * @param param0
 * @returns
 */
export default function MessageDelete({ msgId }: { msgId?: string }) {
	const { data: session, status } = useSession();
	const [loading, setLoading] = useState(false);
	const route = useRouter();
	const path = usePathname();
	const searchParams = useSearchParams();
	const page = parseInt(searchParams.get("page") ?? "0");

	if (
		status === "loading" ||
		status === "unauthenticated" ||
		!session ||
		session.user.admin !== true ||
		!msgId
	) {
		return <></>;
	}

	const handleDelete = async (messageId?: string) => {
		if (!messageId) return;

		const apiUrl = `/api/messages/${messageId}`;

		const options: RequestInit = {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		};

		try {
			setLoading(true);

			const response = await fetch(apiUrl, options);

			const result = await response.json();

			if (response.ok) {
				toast({
					title: "Success",
					description: (
						<span className=" font-medium text-green-700">
							Message deleted!
						</span>
					),
				});
				//refresh main page to reload messages
				const targetUrl = `${path}?${
					page > 0 ? "page=" + page + "&" : ""
				}time=${Date.now()}`;
				route.push(targetUrl);
			} else {
				toast({
					variant: "destructive",
					title: "Error",
					description: result.message ?? "Failed to delete message.",
				});
			}
		} catch (error) {
			//Handle err
			toast({
				variant: "destructive",
				title: "Error",
				description: "Something went wrong.",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="h-10">
			<button
				type="button"
				className="px-2 "
				onClick={() => handleDelete(msgId)}>
				{loading ? (
					<FaSpinner className="animate-spin" />
				) : (
					<BiTrash className="text-red-600" />
				)}
			</button>
		</div>
	);
}
