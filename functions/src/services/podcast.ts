import Podcast from "../database/Podcast";

const getAllPodcasts = async () => {
  try {
    const res = await Podcast.get();
    const data: { id: string }[] = [];
    res.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
    return data;
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

const getOnePodcast = async (podcastId: string) => {
  try {
    const data = await Podcast.doc(podcastId).get();
    if (!data.exists) {
      throw { status: 404, message: `Document id ${podcastId} not found.` };
    } else {
      return data.data();
    }
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

const addOnePodcast = async (newPodcast: any) => {
  try {
    // const data = await Podcast.add(newPodcast);
    // return data.id;
    return { test: "test" };
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

const updateOnePodcast = async (podcastId: string, updatedPodcast: any) => {
  try {
    const res = await Podcast.doc(podcastId).get();
    if (!res.exists) {
      throw { status: 404, message: `Document id ${podcastId} not found.` };
    } else {
      const data = await Podcast.doc(podcastId).update(updatedPodcast);
      return data;
    }
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

const deleteOnePodcast = async (podcastId: string) => {
  try {
    const res = await Podcast.doc(podcastId).get();
    if (!res.exists) {
      throw { status: 404, message: `Document id ${podcastId} not found.` };
    } else {
      const data = await Podcast.doc(podcastId).delete();
      return data;
    }
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
