import { FieldValue } from "firebase-admin/firestore";
import { FileType, generateV4ReadSignedUrlOneHour, Podcast } from "../commons";
import {
  firestore,
  ImagesStorage,
  PodcastsCollection,
  PodcastsStorage,
  UploadsCollection,
  UsersCollection,
} from "../database/db";

const getAllPodcasts = async () => {
  try {
    const res = await PodcastsCollection.where("public", "==", true).get();

    const data: any[] = [];

    // Putting the data into an array
    res.forEach(async (doc) => {
      data.push({ podcastId: doc.id, ...doc.data() });
    });

    const podcastsPromises = data.map(async (podcastDoc) => {
      const imgUrl = await generateV4ReadSignedUrlOneHour(podcastDoc.imgPath);

      return {
        podcastId: podcastDoc.podcastId,
        title: podcastDoc.title,
        description: podcastDoc.description,
        artistName: podcastDoc.artistName,
        durationInMinutes: podcastDoc.durationInMinutes,
        imgUrl,
        genres: podcastDoc.genres,
      };
    });

    const podcasts = await Promise.all(podcastsPromises);

    return podcasts;
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

const getOnePodcast = async (podcastId: string, userId: string) => {
  try {
    const res = await PodcastsCollection.doc(podcastId).get();
    if (!res.exists) {
      throw { status: 404, message: `Podcast ${podcastId} not found.` };
    }
    if (
      res.data()?.public == false &&
      userId.localeCompare(res.data()?.artistId || "") != 0
    ) {
      throw {
        status: 403,
        message: `You do not have access to podcast ${podcastId}`,
      };
    }

    const podcast = {
      title: res.data()?.title,
      description: res.data()?.description,
      artistName: res.data()?.artistName,
      durationInMinutes: res.data()?.durationInMinutes,
      imgUrl: await generateV4ReadSignedUrlOneHour(res.data()?.imgPath || "-"),
      genres: res.data()?.genres,
      public: res.data()?.public,
    };

    return podcast;
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

const addOnePodcast = async (
  podcastUploadId: string,
  imageUploadId: string,
  newPodcast: Podcast
) => {
  try {
    const podcastRes = await UploadsCollection.doc(podcastUploadId).get();
    if (!podcastRes.exists) {
      throw {
        status: 404,
        message: `Podcast upload ${podcastUploadId} not found.`,
      };
    }

    if (podcastRes.data()?.userId != newPodcast.artistId) {
      throw {
        status: 403,
        message: `User does not have access to upload ${podcastUploadId}`,
      };
    }

    const podcastFilepath = podcastRes.data()?.filepath;
    const podcastFiletype = podcastRes.data()?.filetype;
    const durationInMinutes = podcastRes.data()?.durationInMinutes;
    if (
      podcastFiletype != FileType.PODCAST ||
      podcastFilepath == undefined ||
      durationInMinutes == undefined
    ) {
      throw {
        status: 404,
        message: `Podcast upload ${podcastUploadId} not found.`,
      };
    }
    newPodcast.path = podcastFilepath;
    newPodcast.durationInMinutes = durationInMinutes;

    const imageRes = await UploadsCollection.doc(imageUploadId).get();
    if (!imageRes.exists) {
      throw {
        status: 404,
        message: `Image upload ${imageUploadId} not found.`,
      };
    }

    if (imageRes.data()?.userId != newPodcast.artistId) {
      throw {
        status: 403,
        message: `User does not have access to upload ${imageUploadId}`,
      };
    }

    const imageFilepath = imageRes.data()?.filepath;
    const imageFiletype = imageRes.data()?.filetype;
    if (imageFiletype != FileType.IMAGE || imageFilepath == undefined) {
      throw {
        status: 404,
        message: `Image upload ${imageUploadId} not found.`,
      };
    }

    newPodcast.imgPath = imageFilepath;

    const artistDoc = await UsersCollection.doc(newPodcast.artistId).get();
    newPodcast.artistName = artistDoc.data()?.displayName || "";

    const data = await PodcastsCollection.add(newPodcast);

    const batch = firestore.batch();
    batch.update(UsersCollection.doc(newPodcast.artistId), {
      creations: FieldValue.arrayUnion(data.id),
    });
    batch.delete(UploadsCollection.doc(podcastUploadId));
    batch.delete(UploadsCollection.doc(imageUploadId));
    await batch.commit().catch(async (err) => {
      await PodcastsCollection.doc(data.id).delete();
      throw { status: err?.status || 500, message: err?.message || err };
    });

    return { podcastId: data.id };
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

const updateOnePodcast = async (podcastId: string, updatedPodcast: Podcast) => {
  try {
    const res = await PodcastsCollection.doc(podcastId).get();
    if (!res.exists) {
      throw { status: 404, message: `Podcast ${podcastId} not found.` };
    }

    const path = res.data()?.path;
    const imgPath = res.data()?.imgPath;
    const artistId = res.data()?.artistId;
    const artistName = res.data()?.artistName;
    if (
      path == undefined ||
      imgPath == undefined ||
      artistId == undefined ||
      artistName == undefined
    ) {
      throw { status: 404, message: `Podcast ${podcastId} not found.` };
    }

    if (updatedPodcast.artistId != artistId) {
      throw {
        status: 403,
        message: `User does not have access to podcast ${podcastId}`,
      };
    }

    updatedPodcast.path = path;
    updatedPodcast.imgPath = imgPath;
    updatedPodcast.artistName = artistName;

    await PodcastsCollection.doc(podcastId).update(updatedPodcast);

    return { status: "OK", message: "Your podcast has been updated." };
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

const updateOnePodcastAudio = async (
  podcastId: string,
  updatedPodcastUploadId: string,
  userId: string
) => {
  try {
    const podcastRes = await UploadsCollection.doc(
      updatedPodcastUploadId
    ).get();
    if (!podcastRes.exists) {
      throw {
        status: 404,
        message: `Podcast upload ${updatedPodcastUploadId} not found.`,
      };
    }

    if (podcastRes.data()?.userId != userId) {
      throw {
        status: 403,
        message: `User does not have access to upload ${updatedPodcastUploadId}`,
      };
    }

    const updatedPodcastFilepath = podcastRes.data()?.filepath;
    const updatedPodcastFiletype = podcastRes.data()?.filetype;
    const updatedDurationInMinutes = podcastRes.data()?.durationInMinutes;
    if (
      updatedPodcastFiletype != FileType.PODCAST ||
      updatedPodcastFilepath == undefined ||
      updatedDurationInMinutes == undefined
    ) {
      throw {
        status: 404,
        message: `Podcast upload ${updatedPodcastUploadId} not found.`,
      };
    }

    const res = await PodcastsCollection.doc(podcastId).get();
    if (!res.exists) {
      throw { status: 404, message: `Podcast ${podcastId} not found.` };
    }

    if (userId != res.data()?.artistId) {
      throw {
        status: 403,
        message: `User does not have access to podcast ${podcastId}`,
      };
    }

    const oldPodcastFilepath = res.data()?.path;
    if (oldPodcastFilepath == undefined) {
      throw { status: 404, message: `Podcast ${podcastId} not found.` };
    }

    await PodcastsCollection.doc(podcastId).update({
      path: updatedPodcastFilepath,
      durationInMinutes: updatedDurationInMinutes,
    });

    await PodcastsStorage.file(oldPodcastFilepath).delete();

    await UploadsCollection.doc(updatedPodcastUploadId).delete();

    return {
      status: "OK",
      message: "Your podcast audio track has been updated.",
    };
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

const updateOnePodcastImage = async (
  podcastId: string,
  updatedImageUploadId: string,
  userId: string
) => {
  try {
    const imageRes = await UploadsCollection.doc(updatedImageUploadId).get();
    if (!imageRes.exists) {
      throw {
        status: 404,
        message: `IMage upload ${updatedImageUploadId} not found.`,
      };
    }

    if (imageRes.data()?.userId != userId) {
      throw {
        status: 403,
        message: `User does not have access to upload ${updatedImageUploadId}`,
      };
    }

    const updatedImageFilepath = imageRes.data()?.filepath;
    const updatedImageFiletype = imageRes.data()?.filetype;
    if (
      updatedImageFiletype != FileType.IMAGE ||
      updatedImageFilepath == undefined
    ) {
      throw {
        status: 404,
        message: `Podcast upload ${updatedImageUploadId} not found.`,
      };
    }

    const res = await PodcastsCollection.doc(podcastId).get();
    if (!res.exists) {
      throw { status: 404, message: `Podcast ${podcastId} not found.` };
    }

    if (userId != res.data()?.artistId) {
      throw {
        status: 403,
        message: `User does not have access to podcast ${podcastId}`,
      };
    }

    const oldImageFilepath = res.data()?.imgPath;
    if (oldImageFilepath == undefined) {
      throw { status: 404, message: `Podcast ${podcastId} not found.` };
    }

    await PodcastsCollection.doc(podcastId).update({
      imgPath: updatedImageFilepath,
    });

    await ImagesStorage.file(oldImageFilepath).delete();

    await UploadsCollection.doc(updatedImageUploadId).delete();

    return {
      status: "OK",
      message: "Your podcast cover image has been updated.",
    };
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

const deleteOnePodcast = async (podcastId: string, userId: string) => {
  try {
    const res = await PodcastsCollection.doc(podcastId).get();
    if (!res.exists) {
      throw { status: 404, message: `Podcast ${podcastId} not found.` };
    }

    if (userId != res.data()?.artistId) {
      throw {
        status: 403,
        message: `User does not have access to podcast ${podcastId}`,
      };
    }

    const filepath = res.data()?.path;
    const imageFilepath = res.data()?.imgPath;
    if (filepath != undefined && imageFilepath != undefined) {
      await PodcastsStorage.file(filepath).delete();
      await ImagesStorage.file(imageFilepath).delete();
    }
    const batch = firestore.batch();
    batch.delete(PodcastsCollection.doc(podcastId));
    batch.update(UsersCollection.doc(userId), {
      creations: FieldValue.arrayRemove(podcastId),
    });
    await batch.commit();

    return { status: "OK", message: "Your podcast has been removed." };
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

export default {
  getAllPodcasts,
  getOnePodcast,
  addOnePodcast,
  updateOnePodcast,
  updateOnePodcastAudio,
  updateOnePodcastImage,
  deleteOnePodcast,
};
