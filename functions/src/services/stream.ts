import { PodcastsCollection } from "../database/db";

const streamOnePodcast = async (podcastId: string) => {
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

export default {
  streamOnePodcast,
};
