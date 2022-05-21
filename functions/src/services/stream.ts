import { generateV4ReadSignedUrl } from "../commons";
import { PodcastsCollection } from "../database/db";

const streamOnePodcast = async (podcastId: string) => {
  try {
    const res = await PodcastsCollection.doc(podcastId).get();
    if (!res.exists) {
      throw { status: 404, message: `Podcast id ${podcastId} not found.` };
    }

    const filepath = res.data()?.path;
    if (filepath == undefined) {
      throw { status: 404, message: `Podcast id ${podcastId} not found.` };
    }

    // Get stream url
    const podcastUrl = await generateV4ReadSignedUrl(filepath);
    const data = {
      podcastUrl,
      message: "This link will allow you to stream the podcast for 15 minutes.",
    };

    return data;
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

export default {
  streamOnePodcast,
};
