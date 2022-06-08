import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
const credential = require("../../castaway-819d7-92a0eafe1fae.json");

import { Podcast, Upload, User } from "../commons";

// Initializing
admin.initializeApp({
  credential: admin.credential.cert(credential),
  storageBucket: "castaway-819d7.appspot.com",
});

export const firestore = getFirestore();

const converter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
    snap.data() as T,
});

const dataPoint = <T>(collectionPath: string) =>
  firestore.collection(collectionPath).withConverter(converter<T>());

const db = {
  podcasts: dataPoint<Podcast>("podcasts"),
  uploads: dataPoint<Upload>("uploads"),
  users: dataPoint<User>("users"),
};

// Firestore
export const PodcastsCollection = db.podcasts;

export const UploadsCollection = db.uploads;

export const UsersCollection = db.users;

// Cloud Storage
export const PodcastsStorage = getStorage().bucket("castaway-podcasts");

export const ImagesStorage = getStorage().bucket("castaway-images");
