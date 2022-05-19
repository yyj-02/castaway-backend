import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import { converter, Podcast } from "../commons";

// Initializing
initializeApp();
const firestore = getFirestore();

const dataPoint = <T>(collectionPath: string) =>
  firestore.collection(collectionPath).withConverter(converter<T>());

const db = {
  podcasts: dataPoint<Podcast>("podcasts"),
};

export const PodcastsCollection = db.podcasts;
