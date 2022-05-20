import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

import { converter, Podcast, Upload } from "../commons";

// Initializing
initializeApp({
  storageBucket: "castaway-819d7.appspot.com",
});
const firestore = getFirestore();

const dataPoint = <T>(collectionPath: string) =>
  firestore.collection(collectionPath).withConverter(converter<T>());

const db = {
  podcasts: dataPoint<Podcast>("podcasts"),
  uploads: dataPoint<Upload>("uploads"),
};

export const PodcastsCollection = db.podcasts;

export const UploadsCollection = db.uploads;

export const PodcastsStorage = getStorage().bucket("castaway-podcasts");
