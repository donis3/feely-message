import { initializeApp, cert, getApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const appOptions = {
	credential: cert({
		projectId: process.env.FIREBASE_PROJECT_ID,
		clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
		privateKey: process.env.FIREBASE_PRIVATE_KEY,
	}),
};

const app = getApps().length === 1 ? getApp() : initializeApp(appOptions);

const db = getFirestore(app);

export { appOptions, app, db };
