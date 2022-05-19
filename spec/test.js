import { initializeTestApp, assertSucceeds, assertFails } from "@firebase/testing";

const MY_PROJECT_ID = "castaway-819d7";

describe("Castaway Firestore", () => {
  it("Can write items in podcasts collection", async () => {
    const db = initializeTestApp({ projectId: MY_PROJECT_ID })
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
    const res = await testDoc.set(podcast)
    assertSucceeds(res);
  });

  it("Cannot write missing key-value pair", async () => {
    const db = initializeTestApp({ projectId: MY_PROJECT_ID })
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
    await assertFails(testDoc.set(podcast));
  });

  it("Cannot write wrong datatype", async () => {
    const db = initializeTestApp({ projectId: MY_PROJECT_ID })
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
    await assertFails(testDoc.set(podcast));
  });

  it("Cannot write absent podcast title", async () => {
    const db = initializeTestApp({ projectId: MY_PROJECT_ID })
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
    await assertFails(testDoc.set(podcast));
  });

  it("Cannot write absent podcast description", async () => {
    const db = initializeTestApp({ projectId: MY_PROJECT_ID })
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
    await assertFails(testDoc.set(podcast));
  });

  it("Cannot write absent podcast path", async () => {
    const db = initializeTestApp({ projectId: MY_PROJECT_ID })
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
    await assertFails(testDoc.set(podcast));
  });

  it("Cannot write absent podcast image path", async () => {
    const db = initializeTestApp({ projectId: MY_PROJECT_ID })
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
    await assertFails(testDoc.set(podcast));
  });

  it("Cannot write negative podcast duration", async () => {
    const db = initializeTestApp({ projectId: MY_PROJECT_ID })
      .firestore();
    const testDoc = db.collection("podcasts").doc("testDoc");
    const podcast = {
      title: "Sample Title",
      description: "Sample Description",
      path: "path/podcast.mp3",
      imgPath: "path/image.png",
      durationInMinutes: -1,
      artistId: "Demo Artist",
      genres: ["Demo", "Sample"],
      public: true,
    };
    await assertFails(testDoc.set(podcast));
  });

  it("Cannot write absent artistId", async () => {
    const db = initializeTestApp({ projectId: MY_PROJECT_ID })
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
    await assertFails(testDoc.set(podcast));
  });

  it("Cannot write empty genre list", async () => {
    const db = initializeTestApp({ projectId: MY_PROJECT_ID })
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
    await assertFails(testDoc.set(podcast));
  });

  it("Can read publicly listed pocasts", async () => {
    const db = initializeTestApp({ projectId: MY_PROJECT_ID })
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
    await assertSucceeds(testDoc.get());
  });

  it("Cannot read not publicly listed pocasts", async () => {
    const db = initializeTestApp({ projectId: MY_PROJECT_ID })
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
    await assertFails(testDoc.get());
  });
});