import { Podcast, Podcasts } from "../commons";
import { PodcastsCollection, UploadsCollection } from "../database/db";

const getAllPodcasts = async () => {
  try {
    const res = await PodcastsCollection.get();

    // Putting the data into an array
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
      throw { status: 404, message: `Podcast id ${podcastId} not found.` };
    }

    return res.data();
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

const addOnePodcast = async (uploadId: string, newPodcast: Podcast) => {
  try {
    const res = await UploadsCollection.doc(uploadId).get();
    if (!res.exists) {
      throw { status: 404, message: `Upload id ${uploadId} not found.` };
    }

    const filepath = res.data()?.filepath;
    if (filepath == undefined) {
      throw { status: 404, message: `Upload id ${uploadId} not found.` };
    }
    newPodcast.path = filepath;

    const data = await PodcastsCollection.add(newPodcast);
    await UploadsCollection.doc(uploadId)
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
      throw { status: 404, message: `Podcast id ${podcastId} not found.` };
    }

    const data = await PodcastsCollection.doc(podcastId).update(updatedPodcast);

    return data;
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

const deleteOnePodcast = async (podcastId: string) => {
  try {
    const res = await PodcastsCollection.doc(podcastId).get();
    if (!res.exists) {
      throw { status: 404, message: `Podcast id ${podcastId} not found.` };
    }

    const data = await PodcastsCollection.doc(podcastId).delete();

    return data;
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
};
