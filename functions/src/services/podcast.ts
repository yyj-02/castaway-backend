import { Podcast, Podcasts, Upload } from "../commons";
import { PodcastsCollection, UploadsCollection } from "../database/db";

const getAllPodcasts = async () => {
  try {
    const res = await PodcastsCollection.get();
    const data: Podcasts = [];
    res.forEach((doc) => data.push({ podcastId: doc.id, ...doc.data() }));
    return data;
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

const getOnePodcast = async (podcastId: string) => {
  try {
    const res = await PodcastsCollection.doc(podcastId).get();
    if (!res.exists) {
      throw { status: 404, message: `Document id ${podcastId} not found.` };
    } else {
      return res.data();
    }
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

const addOnePodcast = async (newPodcast: Podcast) => {
  try {
    const res = await PodcastsCollection.add(newPodcast);
    return { id: res.id };
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

const updateOnePodcast = async (podcastId: string, updatedPodcast: Podcast) => {
  try {
    const res = await PodcastsCollection.doc(podcastId).get();
    if (!res.exists) {
      throw { status: 404, message: `Document id ${podcastId} not found.` };
    } else {
      const data = await PodcastsCollection.doc(podcastId).update(
        updatedPodcast
      );
      return data;
    }
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

const deleteOnePodcast = async (podcastId: string) => {
  try {
    const res = await PodcastsCollection.doc(podcastId).get();
    if (!res.exists) {
      throw { status: 404, message: `Document id ${podcastId} not found.` };
    } else {
      const data = await PodcastsCollection.doc(podcastId).delete();
      return data;
    }
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

const uploadOnePodcast = async (filepath: string) => {
  try {
    const data: Upload = {
      filepath: filepath,
      durationInMinutes: 20,
    };
    const res = await UploadsCollection.add(data);
    return { uploadId: res.id };
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

export default {
  getAllPodcasts,
  getOnePodcast,
  addOnePodcast,
  updateOnePodcast,
  deleteOnePodcast,
  uploadOnePodcast,
};
