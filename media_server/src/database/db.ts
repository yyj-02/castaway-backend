// Import the functions you need from the SDKs you need
import admin, { ServiceAccount } from "firebase-admin";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";

if (
  process.env.PROJECT_ID === undefined ||
  process.env.PRIVATE_KEY === undefined ||
  process.env.CLIENT_EMAIL === undefined
) {
  throw new Error(
    "Environment variables missing. Get PROJECT_ID, PRIVATE_KEY, CLIENT_EMAIL from Firebase service account."
  );
}

const serviceAccount: ServiceAccount = {
  projectId: `${process.env.PROJECT_ID}`,
  privateKey:
    `-----BEGIN PRIVATE KEY-----${process.env.PRIVATE_KEY}-----END PRIVATE KEY-----\n`.replace(
      /\\n/g,
      "\n"
    ),
  clientEmail: `${process.env.CLIENT_EMAIL}`,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = getFirestore();

export const livestreamsCollection = db.collection("livestreams");
