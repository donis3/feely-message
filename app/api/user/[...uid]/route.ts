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

type GetProps = {
	params: {
		uid: string[] | undefined;
	};
};

export async function GET(req: NextRequest, { params }: GetProps) {
	//Extract uid from params
	const uid = params?.uid && params.uid?.length > 0 ? params.uid[0] : undefined;
	if (!uid || !validateGoogleUid(uid)) return ErrorResponse(404);

	try {
		//Get users collection
		const collectionRef = db.collection("users");
		const docRef = collectionRef.doc(uid);
		const doc = await docRef.get();
		if (!doc.exists) {
			return ErrorResponse(404, "Requested user doesn't exist");
		} else {
			//Extract document data
			const data = doc.data();

			//Mask the email and only respond with these safe to share user information
			const response = {
				name: data?.name,
				email: maskEmail(data?.email),
				image: data?.image,
			};
			return NextResponse.json(response);
		}
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
	{ params }: { params: { uid: string[] | undefined } },
) {
	//Extract uid from params
	const uid = params?.uid && params.uid?.length > 0 ? params.uid[0] : undefined;
	if (!uid || !validateGoogleUid(uid)) return ErrorResponse(404);

	try {
		//Get server session and validate auth
		const session = await getServerSession(authOptions);
		if (!session) return ErrorResponse(401);

		//Verify session id and user id from the request
		if (uid !== session.user.uid) {
			return ErrorResponse(401, "You can't delete someone else's account");
		}

		//Create a batch operator
		const batch = db.batch();

		//Reference the user document and add to batch
		const usersRef = db.collection("users").doc(uid);
		batch.delete(usersRef);

		//Refernce the accounts documents and add to batch
		const accountsRef = db.collection("accounts");
		const accountsSnapshot = await accountsRef.where("userId", "==", uid).get();
		if (accountsSnapshot.size > 0) {
			accountsSnapshot.forEach((doc) => {
				batch.delete(doc.ref);
			});
		}

		//Refernce the session documents and add to batch
		const sessionsRef = db.collection("sessions");
		const sessionsSnapshot = await sessionsRef.where("userId", "==", uid).get();
		if (sessionsSnapshot.size > 0) {
			sessionsSnapshot.forEach((doc) => {
				batch.delete(doc.ref);
			});
		}

		//Reference all messages by the user and add to batch
		const messagesRef = db.collection("messages");
		const query = messagesRef
			.orderBy("createdAt", "desc")
			.where("ownerId", "==", uid);
		const messagesSnapshot = await query.get();
		if (messagesSnapshot.size > 0) {
			messagesSnapshot.docs.forEach((doc) => {
				batch.delete(doc.ref);
			});
		}

		//Commit the batch operation
		batch.commit();

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
