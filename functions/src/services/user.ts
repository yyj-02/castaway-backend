import { FieldValue } from "firebase-admin/firestore";
import { generateV4ReadSignedUrlOneHour, Genres } from "../commons";
import { firestore, PodcastsCollection, UsersCollection } from "../database/db";

const getProfile = async (userId: string) => {
  try {
    const userDoc = await UsersCollection.doc(userId).get();
    if (!userDoc.exists) {
      throw { status: 404, message: "User not found." };
    }

    const data = {
      email: userDoc.data()?.email,
      displayName: userDoc.data()?.displayName,
      numberOfCreations: userDoc.data()?.creations.length,
      numberOfFavorites: userDoc.data()?.favorites.length,
    };

    return data;
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

const changeDisplayName = async (
  userId: string,
  updatedDisplayName: string
) => {
  try {
    const userDoc = await UsersCollection.doc(userId).get();
    if (!userDoc.exists) {
      throw { status: 404, message: "User not found." };
    }

    const batch = firestore.batch();
    batch.update(UsersCollection.doc(userId), {
      displayName: updatedDisplayName,
    });
    userDoc.data()?.creations.forEach((podcastId) => {
      batch.update(PodcastsCollection.doc(podcastId), {
        artistName: updatedDisplayName,
      });
    });
    await batch.commit();

    return { status: "OK", message: "Your display name is updated." };
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

const getAllCreations = async (userId: string) => {
  try {
    const userDoc = await UsersCollection.doc(userId).get();
    if (!userDoc.exists) {
      throw { status: 404, message: "User not found." };
    }

    const data: {
      podcastId: string;
      title: string | undefined;
      description: string | undefined;
      artistName: string | undefined;
      durationInMinutes: number | undefined;
      imgUrl: string;
      genres: Genres | undefined;
      public: boolean | undefined;
    }[] = [];
    userDoc.data()?.creations.forEach(async (podcastId) => {
      const podcastDoc = await PodcastsCollection.doc(podcastId).get();
      const podcast = {
        podcastId: podcastDoc.id,
        title: podcastDoc.data()?.title,
        description: podcastDoc.data()?.description,
        artistName: podcastDoc.data()?.artistName,
        durationInMinutes: podcastDoc.data()?.durationInMinutes,
        imgUrl: await generateV4ReadSignedUrlOneHour(
          podcastDoc.data()?.imgPath || "-"
        ),
        genres: podcastDoc.data()?.genres,
        public: podcastDoc.data()?.public,
      };

      data.push(podcast);
    });

    return data;
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

const getAllFavorites = async (userId: string) => {
  try {
    const userDoc = await UsersCollection.doc(userId).get();
    if (!userDoc.exists) {
      throw { status: 404, message: "User not found." };
    }

    const data: {
      podcastId: string;
      title: string | undefined;
      description: string | undefined;
      artistName: string | undefined;
      durationInMinutes: number | undefined;
      imgUrl: string;
      genres: Genres | undefined;
      public: boolean | undefined;
    }[] = [];
    userDoc.data()?.favorites.forEach(async (podcastId) => {
      const podcastDoc = await PodcastsCollection.doc(podcastId).get();
      if (
        !podcastDoc.exists ||
        (podcastDoc.data()?.public == false &&
          podcastDoc.data()?.artistId != userId)
      ) {
        await UsersCollection.doc(userId).update({
          favorites: FieldValue.arrayRemove(podcastId),
        });
      } else {
        const podcast = {
          podcastId: podcastDoc.id,
          title: podcastDoc.data()?.title,
          description: podcastDoc.data()?.description,
          artistName: podcastDoc.data()?.artistName,
          durationInMinutes: podcastDoc.data()?.durationInMinutes,
          imgUrl: await generateV4ReadSignedUrlOneHour(
            podcastDoc.data()?.imgPath || "-"
          ),
          genres: podcastDoc.data()?.genres,
          public: podcastDoc.data()?.public,
        };

        data.push(podcast);
      }
    });

    return data;
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

const addFavorite = async (userId: string, podcastId: string) => {
  try {
    const podcastDoc = await PodcastsCollection.doc(podcastId).get();
    if (!podcastDoc.exists) {
      throw { status: 404, message: `Podcast ${podcastId} not found.` };
    }

    await UsersCollection.doc(userId).update({
      favorites: FieldValue.arrayUnion(podcastId),
    });
    return { status: "OK", message: "Podcast added to your favorites." };
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

const deleteFavorite = async (userId: string, podcastId: string) => {
  try {
    await UsersCollection.doc(userId).update({
      favorites: FieldValue.arrayRemove(podcastId),
    });
    return { status: "OK", message: "Podcast removed from your favorite." };
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

export default {
  getProfile,
  changeDisplayName,
  getAllCreations,
  getAllFavorites,
  addFavorite,
  deleteFavorite,
};