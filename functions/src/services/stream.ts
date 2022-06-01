import { generateV4ReadSignedUrlOneMinute } from "../commons";
import { PodcastsCollection } from "../database/db";

const streamOnePodcast = async (podcastId: string, userId: string) => {
  try {
    const res = await PodcastsCollection.doc(podcastId).get();
    if (!res.exists) {
      throw { status: 404, message: `Podcast id ${podcastId} not found.` };
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

    const filepath = res.data()?.path;
    if (filepath == undefined) {
      throw { status: 404, message: `Podcast id ${podcastId} not found.` };
    }

    // Get stream url
    const podcastUrl = await generateV4ReadSignedUrlOneMinute(filepath);
    if (podcastUrl.length == 0) {
      throw {
        status: 500,
        message: `Podcast stream link cannot be generated.`,
      };
    }
    const data = {
      podcastUrl,
      message: "This link will expire in 1 minute.",
    };

    return data;
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

export default {
  streamOnePodcast,
};
