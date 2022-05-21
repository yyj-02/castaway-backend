import * as fs from "fs";
import getAudioDurationInSeconds from "get-audio-duration";

import { Upload } from "../commons";
import { UploadsCollection, PodcastsStorage } from "../database/db";

const postOneUpload = async (filepath: string) => {
  try {
    const data: Upload = {
      filepath: filepath.split("_").slice(-1)[0],
      durationInMinutes: 0,
    };

    const duration = getAudioDurationInSeconds(filepath);

    // Upload to cloud storage
    await PodcastsStorage.upload(filepath, {
      destination: data.filepath,
    });

    // Record in firestore
    data.durationInMinutes = Math.round(await duration);
    const res = await UploadsCollection.add(data).catch(async (err: any) => {
      await PodcastsStorage.file(data.filepath).delete();
      throw { status: err?.status || 500, message: err?.message || err };
    });

    return { uploadId: res.id };
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  } finally {
    fs.unlinkSync(filepath);
  }
};

const updateOneUpload = async (uploadId: string, updatedFilepath: string) => {
  try {
    const updatedData: Upload = {
      filepath: updatedFilepath.split("_").slice(-1)[0],
      durationInMinutes: 0,
    };

    const duration = getAudioDurationInSeconds(updatedFilepath);

    const res = await UploadsCollection.doc(uploadId).get();
    if (!res.exists) {
      throw { status: 404, message: `Document id ${uploadId} not found.` };
    }

    const oldFilepath = res.data()?.filepath;
    if (oldFilepath == undefined) {
      throw { status: 404, message: `Upload id ${uploadId} not found.` };
    }

    // Upload new file to cloud storage
    await PodcastsStorage.upload(updatedFilepath, {
      destination: updatedData.filepath,
    });

    // Update in firestore
    updatedData.durationInMinutes = Math.round(await duration);
    const data = await UploadsCollection.doc(uploadId)
      .update(updatedData)
      .catch(async (err: any) => {
        await PodcastsStorage.file(updatedData.filepath).delete();
        throw { status: err?.status || 500, message: err?.message || err };
      });

    // Delete old file from cloud storage
    await PodcastsStorage.file(oldFilepath).delete();

    return data;
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  } finally {
    fs.unlinkSync(updatedFilepath);
  }
};

const deleteOneUpload = async (uploadId: string) => {
  try {
    const res = await UploadsCollection.doc(uploadId).get();
    if (!res.exists) {
      throw { status: 404, message: `Upload id ${uploadId} not found.` };
    }

    const filepath = res.data()?.filepath;
    if (filepath == undefined) {
      throw { status: 404, message: `Upload id ${uploadId} not found.` };
    }

    // Delete from cloud storage
    await PodcastsStorage.file(filepath).delete();

    // Delete from firestore
    const data = await UploadsCollection.doc(uploadId).delete();
    return data;
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

export default {
  postOneUpload,
  updateOneUpload,
  deleteOneUpload,
};
