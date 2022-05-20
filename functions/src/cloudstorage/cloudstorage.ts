import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

// import serviceAccount = require("./path/to/serviceAccountKey.json");

// Initialising
initializeApp({
  // credential: cert(serviceAccount),
  storageBucket: "castaway-819d7.appspot.com",
});

export const PodcastsStorage = getStorage().bucket("castaway-podcasts");
