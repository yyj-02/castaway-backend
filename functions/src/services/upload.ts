import * as fs from "fs";
import getAudioDurationInSeconds from "get-audio-duration";

import { FileType, Upload } from "../commons";
import {
  UploadsCollection,
  PodcastsStorage,
  ImagesStorage,
} from "../database/db";

const postOneUpload = async (filetype: FileType, filepath: string) => {
  try {
    const data: Upload = {
      filetype: filetype,
      filepath: filepath.split("_").slice(-1)[0],
    };

    if (filetype === FileType.PODCAST) {
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

      return { podcastUploadId: res.id };
    } else if (filetype === FileType.IMAGE) {
      // Upload to cloud storage
      await ImagesStorage.upload(filepath, {
        destination: data.filepath,
      });

      // Record in firestore
      const res = await UploadsCollection.add(data).catch(async (err: any) => {
        await ImagesStorage.file(data.filepath).delete();
        throw { status: err?.status || 500, message: err?.message || err };
      });

      return { imageUploadId: res.id };
    } else {
      throw { status: 500, message: "Filetype not compatible." };
    }
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  } finally {
    fs.unlinkSync(filepath);
  }
};

const updateOneUpload = async (
  filetype: FileType,
  uploadId: string,
  updatedFilepath: string
) => {
  try {
    const updatedData: Upload = {
      filetype: filetype,
      filepath: updatedFilepath.split("_").slice(-1)[0],
    };

    if (filetype === FileType.PODCAST) {
      const duration = getAudioDurationInSeconds(updatedFilepath);

      const res = await UploadsCollection.doc(uploadId).get();
      if (!res.exists) {
        throw { status: 404, message: `Upload id ${uploadId} not found.` };
      }

      const oldFilepath = res.data()?.filepath;
      const oldFiletype = res.data()?.filetype;
      if (oldFilepath == undefined || oldFiletype != filetype) {
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
    } else if (filetype === FileType.IMAGE) {
      const res = await UploadsCollection.doc(uploadId).get();
      if (!res.exists) {
        throw { status: 404, message: `Upload id ${uploadId} not found.` };
      }

      const oldFilepath = res.data()?.filepath;
      const oldFiletype = res.data()?.filetype;
      if (oldFilepath == undefined || oldFiletype != filetype) {
        throw { status: 404, message: `Upload id ${uploadId} not found.` };
      }

      // Upload new file to cloud storage
      await ImagesStorage.upload(updatedFilepath, {
        destination: updatedData.filepath,
      });

      // Update in firestore
      const data = await UploadsCollection.doc(uploadId)
        .update(updatedData)
        .catch(async (err: any) => {
          await ImagesStorage.file(updatedData.filepath).delete();
          throw { status: err?.status || 500, message: err?.message || err };
        });

      // Delete old file from cloud storage
      await ImagesStorage.file(oldFilepath).delete();

      return data;
    } else {
      throw { status: 500, message: "Filetype not compatible." };
    }
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
