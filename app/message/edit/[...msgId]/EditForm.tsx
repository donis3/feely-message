"use client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
	cleanCategoryString,
	removeSpecialCharacters,
	wait,
} from "@/lib/utils";
import { Message, MessageData } from "@/types/Forms";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { FaUndoAlt } from "react-icons/fa";

export default function EditForm({ message }: { message: Message }) {
	const initialData: MessageData = {
		message: message.message,
		categories: message.categories.join(", "),
	};
	const [error, setError] = useState({ message: "", categories: "" });
	//Initialize formData using message contents
	const [formData, setFormData] = useState<MessageData>(initialData);
	const [loading, setLoading] = useState(false);
	const route = useRouter();

	const onReset = () => {
		setFormData(initialData);
		setLoading(false);
		setError({ message: "", categories: "" });
	};

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		//Clean old errors
		setError({ message: "", categories: "" });

		//Get clean form data and display errors if needed
		const cleanData = {
			message: removeSpecialCharacters(formData.message),
			categories: cleanCategoryString(formData.categories, false) as string,
		};
		const errors = { message: "", categories: "" };
		if (cleanData.message.length < 5)
			errors.message = "Must be at least 5 characters";
		if (cleanData.categories.length < 1)
			errors.categories = "Must be at least 1 characters";

		if (errors.message.length > 0 || errors.categories.length > 0) {
			setError(errors);
			return;
		}
		try {
			//Submit new form data
			setLoading(true);

			await handleSubmit(cleanData, message?.id);
		} catch (error) {
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (
		formData: MessageData,
		msgId: string | undefined,
	) => {
		try {
			// Send the data to the server in JSON format.
			const JSONdata = JSON.stringify({ id: msgId, ...formData });

			// API endpoint where we send form data.
			const endpoint = "/api/messages";

			// Form the request for sending data to the server.
			const options = {
				// The method is POST because we are sending data.
				method: "PATCH",
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
						<span className=" font-medium text-green-700">Message Updated</span>
					),
				});
				//Re-route back to profile
				route.push("/profile");
			} else {
				toast({
					variant: "destructive",
					title: "Error",
					description: `${result.message ?? "Failed to update message"}`,
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

	return (
		<Card className="w-full">
			<form action="post" onSubmit={onSubmit}>
				<CardHeader>
					<CardTitle className="flex flex-row items-center justify-between">
						<span>Update Message </span>
						<Button
							type="button"
							variant={"ghost"}
							className="gap-1"
							onClick={onReset}>
							Reset <FaUndoAlt className="text-sm" />
						</Button>
					</CardTitle>
					<CardDescription className="pt-4">
						Update your message and don't forget to include at least one
						category. You can seperate your categories using comma (,)
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="my-6 flex flex-col gap-6">
						<div className="flex flex-col gap-2">
							<Label htmlFor="message" className="flex justify-between">
								<span className="flex-1">Your Message</span>
								{error.message.length > 0 && (
									<span className="text-base font-semibold text-red-600">
										{error.message}
									</span>
								)}
							</Label>
							<Textarea
								id="message"
								name="message"
								className={`${error.message.length > 0 && "border-red-500"}`}
								value={formData.message}
								onChange={(e) =>
									setFormData({ ...formData, message: e.target.value })
								}
							/>
						</div>

						<div className="flex flex-col gap-2">
							<Label htmlFor="categories" className="flex justify-between">
								<span className="flex-1">Category</span>
								{error.categories.length > 0 && (
									<span className="text-base font-semibold text-red-600">
										{error.categories}
									</span>
								)}
							</Label>
							<Input
								id="categories"
								name="categories"
								autoComplete="off"
								className={`${error.categories.length > 0 && "border-red-500"}`}
								value={formData.categories}
								onChange={(e) =>
									setFormData({ ...formData, categories: e.target.value })
								}
							/>
							<span className="text-sm font-light">
								Valentines, Anniversary, Birthday... etc
							</span>
						</div>
					</div>
				</CardContent>
				<CardFooter className="justify-end gap-2">
					<Link href={"/profile"} className="w-1/2 md:w-auto">
						<Button variant={"outline"} className="w-full">
							Cancel
						</Button>
					</Link>
					<Button
						disabled={loading}
						type="submit"
						variant={"default"}
						className="w-1/2  md:w-auto">
						Save
					</Button>
				</CardFooter>
			</form>
		</Card>
	);
}
