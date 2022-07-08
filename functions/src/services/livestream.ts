import { Livestream, Livestreams } from "../commons";
import { LivestreamsCollection, UsersCollection } from "../database/db";

const getAllLivestream = async () => {
  try {
    const res = await LivestreamsCollection.get();

    const data: Livestreams = [];

    // Putting the data into an array
    res.forEach(async (doc) => {
      data.push({ livestreamId: doc.id, ...doc.data() });
    });

    const livestreamsPromises = data.map(async (livestreamDoc) => {
      return {
        livestreamId: livestreamDoc.livestreamId,
        title: livestreamDoc.title,
        description: livestreamDoc.description,
        artistName: livestreamDoc.artistName,
        streamerConnected: livestreamDoc.streamerConnected,
      };
    });

    const livestreams = await Promise.all(livestreamsPromises);

    return livestreams;
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

const getOneLivestream = async (livestreamId: string) => {
  try {
    const livestreamDoc = await LivestreamsCollection.doc(livestreamId).get();
    if (!livestreamDoc.exists) {
      throw { status: 404, message: `Livestream ${livestreamId} not found.` };
    }

    const livestreamDetails = {
      title: livestreamDoc.data()?.title,
      description: livestreamDoc.data()?.description,
      artistName: livestreamDoc.data()?.artistName,
      streamerConnected: livestreamDoc.data()?.streamerConnected,
    };

    return livestreamDetails;
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

const addOneLivestream = async (newLivestream: Livestream) => {
  try {
    const artistDoc = await UsersCollection.doc(newLivestream.artistId).get();
    newLivestream.artistName = artistDoc.data()?.displayName || "";

    const data = await LivestreamsCollection.add(newLivestream);

    return { livestreamId: data.id };
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

const deleteOneLivestream = async (livestreamId: string, userId: string) => {
  try {
    const livestreamDoc = await LivestreamsCollection.doc(livestreamId).get();
    if (!livestreamDoc.exists) {
      throw { status: 404, message: `Livestream ${livestreamId} not found.` };
    }

    if (userId != livestreamDoc.data()?.artistId) {
      throw {
        status: 403,
        message: `User does not have access to livestream ${livestreamId}`,
      };
    }

    await LivestreamsCollection.doc(livestreamId).delete();

    return { status: "OK", message: "Your livestream has been removed." };
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

export default {
  getAllLivestream,
  getOneLivestream,
  addOneLivestream,
  deleteOneLivestream,
};
