import { Timestamp } from "firebase-admin/firestore";

export type MessageData = {
	message: string;
	categories: string;
};


export type Message = {
	id?: string;
	message: string;
	categories: string[];
	ownerId: string;
	author: {
		name: string | null | undefined;
		email: string | null | undefined;
		picture: string | null | undefined;
	};
	createdAt: Timestamp;
};
