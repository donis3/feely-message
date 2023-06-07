// This is an example of how to access a session from an API route
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import { MessageData, Message } from "@/types/Forms";
import { FieldValue, type Timestamp } from "firebase-admin/firestore";
import { db } from "@/firebase.config.js";
import {
	cleanCategoryString,
	maskEmail,
	removeSpecialCharacters,
	wait,
} from "@/lib/utils";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Will return all messages if no id provided (/api/messages)
 * Will return single message if id provided (/api/messages/{messageId})
 * Get queries
 *  ?by={userId} --> returns messages by this user
 *  ?page=2 --> pagination.
 * For multiple messages, response will have
 * @param req
 * @param param1
 * @returns
 */
export async function GET(
	req: NextRequest,
	{ params }: { params: { slug: string[] | undefined } },
) {
	try {
		const { slug } = params;
		const messageId: string | undefined =
			slug && slug.length > 0 ? slug[0] : undefined;

		const { searchParams } = new URL(req.url);

		const by = validateGoogleUid(searchParams.get("by") as string)
			? searchParams.get("by")
			: null;
		let paramPage = parseInt(searchParams.get("page") as string);

		//Get tag filter
		const tag = searchParams.get("tag") ? searchParams.get("tag") : null;

		// PAGINATION CONFIG (Default 10)
		const page: number = paramPage > 0 ? paramPage : 1;
		const perPage = process.env?.MESSAGE_PER_PAGE
			? parseInt(process.env?.MESSAGE_PER_PAGE)
			: 10;

		//Get firestore collection
		const messagesRef = db.collection("messages");

		//IF: REQUESTED SINGLE MESSAGE
		if (messageId) {
			const messageRef = messagesRef.doc(messageId);
			const doc = await messageRef.get();
			if (!doc.exists) {
				return ErrorResponse(404, "Requested message doesn't exist");
			} else {
				const data = { ...doc?.data(), id: doc.id };
				//Revalidate
				revalidatePath("/");
				revalidatePath("/profile");
				revalidatePath("/tag");
				revalidateTag("messages");
				return NextResponse.json(data);
			}
		}

		//IF: Requested multiple messages
		const queryCount = { count: 0 };
		let snapshot;
		if (!by && !tag) {
			//Get total size
			const pageCountSnapshot = await messagesRef
				.orderBy("createdAt", "desc")
				.count()
				.get();
			queryCount.count = pageCountSnapshot.data()?.count;

			snapshot = await messagesRef
				.orderBy("createdAt", "desc")
				.limit(perPage)
				.offset(perPage * (page - 1))
				.get();
		} else if (tag) {
			//Get total size
			const pageCountSnapshot = await messagesRef
				.orderBy("createdAt", "desc")
				.where("categories", "array-contains", tag)
				.count()
				.get();
			queryCount.count = pageCountSnapshot.data()?.count;

			snapshot = await messagesRef
				.orderBy("createdAt", "desc")
				.where("categories", "array-contains", tag)
				.limit(perPage)
				.offset(perPage * (page - 1))
				.get();
		} else {
			//Get total size
			const pageCountSnapshot = await messagesRef
				.orderBy("createdAt", "desc")
				.where("ownerId", "==", by)
				.count()
				.get();
			queryCount.count = pageCountSnapshot.data()?.count;

			snapshot = await messagesRef
				.orderBy("createdAt", "desc")
				.where("ownerId", "==", by)
				.limit(perPage)
				.offset(perPage * (page - 1))
				.get();
		}

		//Create a result object with the data
		const result: {
			page: number;
			pages: number;
			size: number;
			total: number;
			data: Message[];
		} = {
			size: snapshot.size,
			page: page,
			pages: Math.ceil(queryCount.count / perPage),
			total: queryCount.count,
			data: [],
		};

		snapshot.forEach((doc) => {
			const msgData = doc.data();
			result.data.push({
				id: doc.id,
				message: msgData.message,
				categories: msgData.categories,
				ownerId: msgData.ownerId,
				createdAt: msgData.createdAt,
				author: msgData.author,
			});
		});

		//Revalidate
		revalidatePath("/");
		revalidatePath("/profile");
		revalidatePath("/tag");
		revalidateTag("messages");

		return NextResponse.json(result);
	} catch (error) {
		console.log(error);
		return ErrorResponse();
	}
}

/**
 * Create a new message if user is authorized
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
	try {
		//Get server session and validate auth
		const session = await getServerSession(authOptions);
		if (!session) return ErrorResponse(401);

		//Get form data
		const data: MessageData = await req.json();

		//Clean data
		const cleanData = {
			message: removeSpecialCharacters(data.message),
			categories: cleanCategoryString(data.categories, true) as string[],
		};

		//Validate
		if (cleanData?.message.length < 5)
			return ErrorResponse(400, "Message must be at least 4 characters");
		if (cleanData?.categories.length < 1)
			return ErrorResponse(400, "Categories must be at least 1 characters");

		//Create message object and validate again
		const msg: Message = {
			message: cleanData.message,
			categories: cleanData.categories,
			ownerId: session.user.uid,
			author: {
				name: session.user.name,
				email: maskEmail(session.user.email),
				picture: session.user.image,
			},
			createdAt: FieldValue.serverTimestamp() as Timestamp,
		};
		if (msg.categories.length < 1)
			return ErrorResponse(400, "You must include at least 1 category.");

		//Add to collection and get the new document id
		const messagesRef = db.collection("messages");
		const response = await messagesRef.add(msg);

		//Revalidate
		revalidatePath("/");
		revalidatePath("/profile");
		revalidatePath("/tag");
		revalidateTag("messages");
		return NextResponse.json({ message: "success", data: { id: response.id } });
	} catch (error) {
		return ErrorResponse();
	}
}

/**
 * Create a new message if user is authorized
 * @param req
 * @returns
 */
export async function PATCH(req: NextRequest) {
	try {
		//Get server session and validate auth
		const session = await getServerSession(authOptions);
		if (!session) return ErrorResponse(401);

		//Get user id
		const uid = session.user.uid;

		//Get form data
		const data: {
			message: string | undefined;
			categories: string | undefined;
			id: string | undefined;
		} = await req.json();

		if (!data.id) return ErrorResponse(400);

		//Collection and doc ref init
		const messagesRef = db.collection("messages");
		const messageRef = messagesRef.doc(data.id);

		//Find the message in question and verify that the current user is the author
		const doc = await messageRef.get();
		if (!doc.exists) {
			return ErrorResponse(404, "Failed to update, message no longer exists.");
		} else {
			//A message is found with the given ID. Verify ownership
			const data = doc?.data();
			if (!data || !data.ownerId || data.ownerId !== uid) {
				// Ownership verification failed
				return ErrorResponse(
					401,
					"You don't have permission to update this message",
				);
			}
		}

		// Proceed with the update. Clean the data first
		//Clean data
		const cleanData = {
			message: removeSpecialCharacters(data.message),
			categories: cleanCategoryString(data.categories ?? "", true) as string[],
		};

		//Validate
		if (cleanData?.message.length < 5)
			return ErrorResponse(400, "Message must be at least 4 characters");
		if (cleanData?.categories.length < 1)
			return ErrorResponse(400, "Categories must be at least 1 characters");

		const response = await messageRef.update(cleanData);

		//Revalidate
		revalidatePath("/");
		revalidatePath("/profile");
		revalidatePath("/tag");
		revalidateTag("messages");
		return NextResponse.json({
			message: "success",
			data: cleanData,
		});
	} catch (error) {
		return ErrorResponse();
	}
}

/**
 * Delete a message if user is authorized and owns the message
 * @param req
 * @returns
 */
export async function DELETE(
	req: NextRequest,
	{ params }: { params: { slug: string[] | undefined } },
) {
	//Validate message id exists
	const messageId: string | undefined =
		params.slug && params.slug.length > 0 ? params.slug[0] : undefined;
	if (!messageId) return ErrorResponse(404);

	try {
		//Get server session and validate auth
		const session = await getServerSession(authOptions);
		if (!session) return ErrorResponse(401);

		//Get user id
		const uid = session.user.uid;

		//Collection and doc ref init
		const messagesRef = db.collection("messages");
		const messageRef = messagesRef.doc(messageId);

		//Find the message in question and verify that the current user is the author
		const doc = await messageRef.get();
		if (!doc.exists) {
			return ErrorResponse(404, "Failed to update, message no longer exists.");
		} else {
			//A message is found with the given ID. Verify ownership
			const data = doc?.data();
			if (!data || !data.ownerId || data.ownerId !== uid) {
				// Ownership verification failed
				return ErrorResponse(
					401,
					"You don't have permission to update this message",
				);
			}
		}

		//Delete document
		await messageRef.delete();

		//Revalidate
		revalidatePath("/");
		revalidatePath("/profile");
		revalidatePath("/tag");
		revalidateTag("messages");
		return NextResponse.json({
			message: "success",
		});
	} catch (error) {
		return ErrorResponse();
	}
}

//Helper function for error responses
function ErrorResponse(code?: number, message?: string) {
	if (!message) message = "";
	switch (code) {
		case 401:
			return NextResponse.json(
				{ error: "Unauthorized", message },
				{ status: 401 },
			);
			break;

		case 400:
			return NextResponse.json(
				{ error: "Bad Request", message },
				{ status: 400 },
			);
			break;
		case 404:
			return NextResponse.json(
				{ error: "Not Found", message },
				{ status: 404 },
			);
			break;
		default:
			return NextResponse.json(
				{ error: "Internal Server Error" },
				{ status: 500 },
			);
			break;
	}
}

function validateGoogleUid(uid: string): boolean {
	const pattern = /^[a-zA-Z0-9_-]+$/;
	return pattern.test(uid);
}
