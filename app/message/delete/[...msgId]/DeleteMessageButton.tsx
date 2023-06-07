"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";

export default function DeleteMessageButton({ msgId }: { msgId?: string }) {
	const [loading, setLoading] = useState(false);
	const route = useRouter();

	const handleDelete = async (messageId?: string) => {
		if (!messageId) return;

		const apiUrl = `/api/messages/${msgId}`;

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
				route.push("/profile");
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

	if (!msgId) return <></>;
	return (
		<Button
			type="button"
			variant={"destructive"}
			onClick={() => handleDelete(msgId)}
			disabled={loading}>
			{loading && <FaSpinner className="mr-2 animate-spin" />}
			Delete
		</Button>
	);
}
