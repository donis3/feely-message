import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Returns a promise that will resolve after the given number of seconds.
 * @param seconds
 */
export function wait(seconds: number) {
	const waitTime = seconds > 100 ? seconds : seconds * 1000;
	return new Promise((resolve) => setTimeout(resolve, waitTime));
}

/**
 * Mask an email address and return "u*****e[at]example.com"
 * @param email valid email string
 * @returns masked email string
 */
export function maskEmail(email: string | null | undefined) {
	if (!email) return "";
	const parts = email.split("@");
	if (parts.length <= 1) return email;
	const username = parts[0];
	const domain = parts[1];
	if (username.length <= 2) {
		return `..@${domain}`;
	}
	const repeat = username.length < 10 ? 5 : 8; //Hide real length of email
	const maskedUsername =
		username.charAt(0) +
		"*".repeat(repeat) +
		username.charAt(username.length - 1);

	return maskedUsername + "@" + domain;
}

export function cleanCategoryString(
	str: string,
	getArray: boolean = false,
): string | string[] {
	//Empty string handler
	if (!str) return getArray ? [] : "";
	//1. Remove unwanted chars
	let filtered = str.trim().replace(/[^a-zA-Z0-9-,\s]/g, "");
	//2. Convert multiple commas
	filtered = filtered.replace(/,+/g, ",");
	//3. Create array and remove empties
	const tags = filtered.split(",").filter((item) => item.trim().length > 0);
	if (tags.length === 0) return "";

	//3. Filter each tag
	const filteredTags = tags.map((tag) => {
		//Convert multiple spaces to single dash
		let cleanTag = tag.trim().replace(/\s+/g, "-").toLocaleLowerCase();
		//remove unwanted chars. Only allow alphanumeric and dash
		return cleanTag.replace(/[^a-zA-Z0-9-]/g, "");
	});

	//Remove repeating tags
	const result = Array.from(new Set(filteredTags));

	//Return as array or string
	return getArray ? result : result.join(",");
}

/**
 * Clean message body with this function.
 * @param input
 * @returns
 */
export function removeSpecialCharacters(input: string | undefined): string {
	if (!input) return "";
	const regex = /[^\p{L}\p{N}\p{P}\p{Z}\p{S}]/gu;

	return input
		.trim()
		.replace(/\n/g, " ")
		.replace(regex, "")
		.replace(/\s+/g, " "); //Convert multiple spaces to one
}
