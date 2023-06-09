"use client";
import React, { useRef } from "react";
import { BiPlus } from "react-icons/bi";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import MessageForm from "./MessageForm";
import { useToast } from "./ui/use-toast";
import { MessageData } from "@/types/Forms";
import { useRouter } from "next/navigation";

export default function MsgDialog({
	initialData,
}: {
	initialData?: MessageData;
}) {
	const { toast } = useToast();
	const [open, setOpen] = React.useState(false);
	const formRef = useRef<HTMLFormElement>();
	const route = useRouter();

	const handleSubmit = async (formData: MessageData) => {
		try {
			// Send the data to the server in JSON format.
			const JSONdata = JSON.stringify(formData);

			// API endpoint where we send form data.
			const endpoint = "/api/messages";

			// Form the request for sending data to the server.
			const options = {
				// The method is POST because we are sending data.
				method: "POST",
				// Tell the server we're sending JSON.
				headers: {
					"Content-Type": "application/json",
				},
				// Body of the request is the JSON data we created above.
				body: JSONdata,
			};

			// Send the form data to our forms API on Vercel and get a response.
			const response = await fetch(endpoint, options);

			// Get the response data from server as JSON.
			// If server returns the name submitted, that means the form works.
			const result = await response.json();

			if (response.ok) {
				toast({
					title: "Success",
					description: (
						<span className=" font-medium text-green-700">
							New message added!
						</span>
					),
				});
				//refresh main page to reload messages

				//If we had initial data, and at least 1 category, just send to /tag/xxx instead of main page. Add ?time to refresh cache
				if (
					initialData &&
					initialData.categories.length > 0 &&
					result.data.categories &&
					result.data.categories.length > 0
				) {
					return route.push(
						`/tag/${result.data.categories[0]}/?time=${Date.now()}`,
					);
				} else {
					return route.push("/?time=" + Date.now());
				}
			} else {
				toast({
					variant: "destructive",
					title: "Error",
					description:
						result.message.length > 0
							? result.message
							: `Failed to add new message.`,
				});
			}
		} catch (error) {
			//Handle err
			toast({
				variant: "destructive",
				title: "Error",
				description: "Something went wrong.",
			});
		}
	};

	const handleSubmitBtn = () => {
		if (formRef.current) {
			formRef.current.requestSubmit();
		}
	};

	const closePanel = () => {
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<div className="w-full">
				<DialogTrigger asChild>
					<Button
						variant={"outline"}
						className="flex gap-2 dark:border-dashed dark:border-white/25">
						<BiPlus />
						New Message
					</Button>
				</DialogTrigger>
				<DialogContent className="min-h-full min-w-full max-w-full md:min-h-0 md:min-w-0 md:max-w-xl">
					<DialogHeader>
						<DialogTitle>Create a new message</DialogTitle>
						<DialogDescription>
							Create a message and share with the world! Don't forget to add
							occasions for which this message is suitable for.
						</DialogDescription>
					</DialogHeader>
					<MessageForm
						handleSubmit={handleSubmit}
						successCallback={closePanel}
						formData={
							initialData ? initialData : { message: "", categories: "" }
						}
						submitId={"msg_form_submit_btn"}
					/>

					<DialogFooter>
						<Button
							type="button"
							onClick={handleSubmitBtn}
							id="msg_form_submit_btn">
							Share Message
						</Button>
					</DialogFooter>
				</DialogContent>
			</div>
		</Dialog>
	);
}
