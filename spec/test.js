const assert = require("assert");
const firebase = require("@firebase/testing");

const MY_PROJECT_ID = "castaway-819d7";

describe("Castaway Firestore", () => {
  it("Can write items in podcasts collection", async () => {
    const db = firebase
      .initializeTestApp({ projectId: MY_PROJECT_ID })
      .firestore();
    const testDoc = db.collection("podcasts").doc("testDoc");
    const podcast = {
      title: "Sample Title",
      description: "Sample Description",
      path: "path/podcast.mp3",
      imgPath: "path/image.png",
      durationInMinutes: 60,
      artistId: "Demo Artist",
      genres: ["Demo"],
      public: true,
    };
    await firebase.assertSucceeds(testDoc.set(podcast));
  });

  it("Cannot write missing key-value pair", async () => {
    const db = firebase
      .initializeTestApp({ projectId: MY_PROJECT_ID })
      .firestore();
    const testDoc = db.collection("podcasts").doc("testDoc");
    const podcast = {
      title: "Sample Title",
      description: "Sample Description",
      path: "path/podcast.mp3",
      imgPath: "path/image.png",
      artistId: "Demo Artist",
      genres: ["Demo", "Sample"],
      public: true,
    };
    await firebase.assertFails(testDoc.set(podcast));
  });

  it("Cannot write wrong datatype", async () => {
    const db = firebase
      .initializeTestApp({ projectId: MY_PROJECT_ID })
      .firestore();
    const testDoc = db.collection("podcasts").doc("testDoc");
    const podcast = {
      title: true,
      description: "Sample Description",
      path: "path/podcast.mp3",
      imgPath: "path/image.png",
      durationInMinutes: 60,
      artistId: "",
      genres: ["Demo", "Sample"],
      public: true,
    };
    await firebase.assertFails(testDoc.set(podcast));
  });

  it("Cannot write absent podcast title", async () => {
    const db = firebase
      .initializeTestApp({ projectId: MY_PROJECT_ID })
      .firestore();
    const testDoc = db.collection("podcasts").doc("testDoc");
    const podcast = {
      title: "",
      description: "Sample Description",
      path: "path/podcast.mp3",
      imgPath: "path/image.png",
      durationInMinutes: 60,
      artistId: "Demo Artist",
      genres: ["Demo", "Sample"],
      public: true,
    };
    await firebase.assertFails(testDoc.set(podcast));
  });

  it("Cannot write absent podcast description", async () => {
    const db = firebase
      .initializeTestApp({ projectId: MY_PROJECT_ID })
      .firestore();
    const testDoc = db.collection("podcasts").doc("testDoc");
    const podcast = {
      title: "Sample Title",
      description: " ",
      path: "path/podcast.mp3",
      imgPath: "path/image.png",
      durationInMinutes: 60,
      artistId: "Demo Artist",
      genres: ["Demo", "Sample"],
      public: true,
    };
    await firebase.assertFails(testDoc.set(podcast));
  });

  it("Cannot write absent podcast path", async () => {
    const db = firebase
      .initializeTestApp({ projectId: MY_PROJECT_ID })
      .firestore();
    const testDoc = db.collection("podcasts").doc("testDoc");
    const podcast = {
      title: "Sample Title",
      description: "Sample Description",
      path: "",
      imgPath: "path/image.png",
      durationInMinutes: 60,
      artistId: "Demo Artist",
      genres: ["Demo", "Sample"],
      public: true,
    };
    await firebase.assertFails(testDoc.set(podcast));
  });

  it("Cannot write absent podcast image path", async () => {
    const db = firebase
      .initializeTestApp({ projectId: MY_PROJECT_ID })
      .firestore();
    const testDoc = db.collection("podcasts").doc("testDoc");
    const podcast = {
      title: "Sample Title",
      description: "Sample Description",
      path: "path/podcast.mp3",
      imgPath: "",
      durationInMinutes: 60,
      artistId: "Demo Artist",
      genres: ["Demo", "Sample"],
      public: true,
    };
    await firebase.assertFails(testDoc.set(podcast));
  });

  it("Cannot write absent artistId", async () => {
    const db = firebase
      .initializeTestApp({ projectId: MY_PROJECT_ID })
      .firestore();
    const testDoc = db.collection("podcasts").doc("testDoc");
    const podcast = {
      title: "Sample Title",
      description: "Sample Description",
      path: "path/podcast.mp3",
      imgPath: "path/image.png",
      durationInMinutes: 60,
      artistId: "",
      genres: ["Demo", "Sample"],
      public: true,
    };
    await firebase.assertFails(testDoc.set(podcast));
  });

  it("Cannot write empty genre list", async () => {
    const db = firebase
      .initializeTestApp({ projectId: MY_PROJECT_ID })
      .firestore();
    const testDoc = db.collection("podcasts").doc("testDoc");
    const podcast = {
      title: "Sample Title",
      description: "Sample Description",
      path: "path/podcast.mp3",
      imgPath: "path/image.png",
      durationInMinutes: 60,
      artistId: "Demo Artist",
      genres: [],
      public: true,
    };
    await firebase.assertFails(testDoc.set(podcast));
  });

  it("Can read publicly listed pocasts", async () => {
    const db = firebase
      .initializeTestApp({ projectId: MY_PROJECT_ID })
      .firestore();
    const testDoc = db.collection("podcasts").doc("testDoc");
    const podcast = {
      title: "Sample Title",
      description: "Sample Description",
      path: "path/podcast.mp3",
      imgPath: "path/image.png",
      durationInMinutes: 60,
      artistId: "Demo Artist",
      genres: ["Demo", "Sample"],
      public: true,
    };
    await testDoc.set(podcast);
    await firebase.assertSucceeds(testDoc.get());
  });

  it("Cannot read not publicly listed pocasts", async () => {
    const db = firebase
      .initializeTestApp({ projectId: MY_PROJECT_ID })
      .firestore();
    const testDoc = db.collection("podcasts").doc("testDoc");
    const podcast = {
      title: "Sample Title",
      description: "Sample Description",
      path: "path/podcast.mp3",
      imgPath: "path/image.png",
      durationInMinutes: 60,
      artistId: "Demo Artist",
      genres: ["Demo", "Sample"],
      public: false,
    };
    await testDoc.set(podcast);
    await firebase.assertFails(testDoc.get());
  });
});