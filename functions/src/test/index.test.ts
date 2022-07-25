import axios from "axios";
var assert = require("assert");
const fs = require("fs");
import { resolve } from "path";
import { FileType, Genre, Podcast, Upload } from "../commons";

import authService from "../services/auth";
import podcastService from "../services/podcast";
import uploadService from "../services/upload";

describe("Podcast", async function () {
  let idToken: string = "";
  let userId: string = "";
  let podcastId: string = "";

  before(async function () {
    const demoAccount = {
      email: "tests-account@gmail.com",
      password: "DifficultPassword12#",
      displayName: "tests-account",
    };

    const userRes = await authService.signup(demoAccount);

    const userData = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.IDENTITY_SERVER_API_KEY}`,
      { idToken: userRes.idToken }
    );

    idToken = userRes.idToken;
    userId = userData.data.users[0].localId;
  });

  after(async function () {
    await authService.deleteAccount(idToken);
  });

  it("should retrieve all podcast without error", async function () {
    const podcasts = await podcastService.getAllPodcasts();
    assert.equal(Array.isArray(podcasts), true);
  });

  it("should retrieve one podcast without error", async function () {
    const podcasts = await podcastService.getAllPodcasts();
    const podcast = await podcastService.getOnePodcast(
      podcasts[0].podcastId,
      userId
    );

    assert.equal(podcasts[0].title, podcast.title);
  });

  it("should create a podcast without error", async function () {
    await fs.copyFile(
      resolve(__dirname, "./assets/example_audio.mp3"),
      resolve(__dirname, "./assets/audio.mp3"),
      (err: any) => {
        if (err) {
          console.log("Error Found:", err);
        }
      }
    );
    await fs.copyFile(
      resolve(__dirname, "./assets/example_audio.mp3"),
      resolve(__dirname, "./assets/image.jpg"),
      (err: any) => {
        if (err) {
          console.log("Error Found:", err);
        }
      }
    );

    const podcastUpload: Upload = {
      userId: userId,
      filetype: FileType.PODCAST,
      filepath: resolve(__dirname, "./assets/audio.mp3"),
      durationInMinutes: 20,
    };
    const imageUpload: Upload = {
      userId: userId,
      filetype: FileType.IMAGE,
      filepath: resolve(__dirname, "./assets/image.jpg"),
    };

    const podcast = await uploadService.postOneUpload(podcastUpload);
    const image = await uploadService.postOneUpload(imageUpload);

    if (
      podcast.podcastUploadId === undefined ||
      image.imageUploadId === undefined
    ) {
      throw new Error("upload unsuccessful");
    }
    const newPodcast: Podcast = {
      artistId: userId,
      artistName: "",
      description: "description",
      title: "UniwurTest",
      durationInMinutes: 0,
      genres: [Genre.NEWS],
      imgPath: "",
      path: "",
      public: true,
    };
    const createRes = await podcastService.addOnePodcast(
      podcast.podcastUploadId,
      image.imageUploadId,
      newPodcast
    );

    podcastId = createRes.podcastId;

    const podcastRes = await podcastService.getOnePodcast(podcastId, userId);

    assert.equal(podcastRes.title, newPodcast.title);
  });

  it("should delete a podcast without error", async function () {
    const deleteRes = await podcastService.deleteOnePodcast(podcastId, userId);

    assert.equal(deleteRes.status, "OK");
  });
});
