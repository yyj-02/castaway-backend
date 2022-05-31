import { FileType, Podcast, Podcasts } from "../commons";
import {
  ImagesStorage,
  PodcastsCollection,
  PodcastsStorage,
  UploadsCollection,
} from "../database/db";

const getAllPodcasts = async () => {
  try {
    const res = await PodcastsCollection.where("public", "==", true).get();

    // Putting the data into an array
    const data: Podcasts = [];
    res.forEach((doc) => data.push({ podcastId: doc.id, ...doc.data() }));

    return data;
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

const getOnePodcast = async (podcastId: string, userId: string) => {
  try {
    const res = await PodcastsCollection.doc(podcastId).get();
    console.log(res.data());
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

    return res.data();
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

    const imageFilepath = imageRes.data()?.filepath;
    const imageFiletype = imageRes.data()?.filetype;
    if (imageFiletype != FileType.IMAGE || imageFilepath == undefined) {
      throw {
        status: 404,
        message: `Image upload ${imageUploadId} not found.`,
      };
    }
    newPodcast.imgPath = imageFilepath;

    const data = await PodcastsCollection.add(newPodcast);
    await UploadsCollection.doc(podcastUploadId)
      .delete()
      .catch(async (err) => {
        await PodcastsCollection.doc(data.id).delete();
        throw { status: err?.status || 500, message: err?.message || err };
      });

    await UploadsCollection.doc(imageUploadId)
      .delete()
      .catch(async (err) => {
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
    if (path == undefined || imgPath == undefined || artistId == undefined) {
      throw { status: 404, message: `Podcast ${podcastId} not found.` };
    }

    updatedPodcast.path = path;
    updatedPodcast.imgPath = imgPath;
    updatedPodcast.artistId = artistId;

    await PodcastsCollection.doc(podcastId).update(updatedPodcast);

    return { status: "OK", message: "Your podcast has been updated." };
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

const updateOnePodcastAudio = async (
  podcastId: string,
  updatedPodcastUploadId: string
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
  updatedImageUploadId: string
) => {
  try {
    const imageRes = await UploadsCollection.doc(updatedImageUploadId).get();
    if (!imageRes.exists) {
      throw {
        status: 404,
        message: `IMage upload ${updatedImageUploadId} not found.`,
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

const deleteOnePodcast = async (podcastId: string) => {
  try {
    const res = await PodcastsCollection.doc(podcastId).get();
    if (!res.exists) {
      throw { status: 404, message: `Podcast ${podcastId} not found.` };
    }

    const filepath = res.data()?.path;
    const imageFilepath = res.data()?.imgPath;
    if (filepath != undefined && imageFilepath != undefined) {
      await PodcastsStorage.file(filepath).delete();
      await ImagesStorage.file(imageFilepath).delete();
    }

    await PodcastsCollection.doc(podcastId).delete();

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
