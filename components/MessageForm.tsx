"use client";
import React, { FormEvent, useRef, useState, useEffect } from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { MessageData } from "@/types/Forms";
import { cleanCategoryString, removeSpecialCharacters } from "@/lib/utils";

interface MessageFormProps {
	handleSubmit: Function;
	successCallback: Function;
	formData: MessageData;
	submitId: string;
}

const MessageForm = (props: MessageFormProps) => {
	const [error, setError] = useState({ message: "", categories: "" });
	const [formData, setFormData] = useState<MessageData>(props.formData);
	const [loading, setLoading] = useState(false);
	const formRef = useRef<HTMLFormElement | null>(null);

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		//Clean old errors
		setError({ message: "", categories: "" });

		//Get clean form data and display errors if needed
		const cleanData = {
			message: removeSpecialCharacters(formData.message),
			categories: cleanCategoryString(formData.categories),
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

		//Submit new form data
		setLoadingTrue();
		await props.handleSubmit(cleanData);
		setLoadingFalse();
		return props.successCallback();
	};

	useEffect(() => {
		const btnElement = document.querySelector(`#${props.submitId}`);

		function onSubmitBtnClick() {
			if (loading) {
				console.log("Cant submit while loading");
				return;
			}
			formRef.current?.requestSubmit();
		}
		btnElement?.addEventListener("click", onSubmitBtnClick);

		return () => {
			btnElement?.removeEventListener("click", onSubmitBtnClick);
		};
	}, []);

	//Disable the submit button when loading
	const setLoadingTrue = () => {
		setLoading(true);
		const btnElement = document.querySelector<HTMLButtonElement>(
			`#${props.submitId}`,
		);
		if (btnElement) {
			btnElement.disabled = true;
			btnElement.innerHTML = "Submitting";
		}
	};

	const setLoadingFalse = () => {
		setLoading(false);
		const btnElement = document.querySelector<HTMLButtonElement>(
			`#${props.submitId}`,
		);
		if (btnElement) {
			btnElement.disabled = false;
			btnElement.innerHTML = "Share Message";
		}
	};

	return (
		<form action="post" onSubmit={onSubmit} ref={formRef}>
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
		</form>
	);
};

export default MessageForm;
