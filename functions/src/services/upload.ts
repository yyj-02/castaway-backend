import * as fs from "fs";
import getAudioDurationInSeconds from "get-audio-duration";

import { FileType, Upload } from "../commons";
import {
  UploadsCollection,
  PodcastsStorage,
  ImagesStorage,
} from "../database/db";

const postOneUpload = async (upload: Upload) => {
  try {
    const data: Upload = {
      userId: upload.userId,
      filetype: upload.filetype,
      filepath: upload.filepath.split("_").slice(-1)[0],
    };

    if (data.filetype === FileType.PODCAST) {
      const duration = getAudioDurationInSeconds(upload.filepath);

      // Upload to cloud storage
      await PodcastsStorage.upload(upload.filepath, {
        destination: data.filepath,
      });

      // Record in firestore
      data.durationInMinutes = Math.round(await duration);
      const res = await UploadsCollection.add(data).catch(async (err: any) => {
        await PodcastsStorage.file(data.filepath).delete();
        throw { status: err?.status || 500, message: err?.message || err };
      });

      return { podcastUploadId: res.id };
    } else if (data.filetype === FileType.IMAGE) {
      // Upload to cloud storage
      await ImagesStorage.upload(upload.filepath, {
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
    fs.unlinkSync(upload.filepath);
  }
};

const updateOneUpload = async (uploadId: string, updatedUpload: Upload) => {
  try {
    const updatedData: Upload = {
      userId: updatedUpload.userId,
      filetype: updatedUpload.filetype,
      filepath: updatedUpload.filepath.split("_").slice(-1)[0],
    };

    const res = await UploadsCollection.doc(uploadId).get();
    if (!res.exists) {
      throw { status: 404, message: `Upload id ${uploadId} not found.` };
    }

    const oldFilepath = res.data()?.filepath;
    const oldFiletype = res.data()?.filetype;
    if (oldFilepath == undefined || oldFiletype != updatedData.filetype) {
      throw { status: 404, message: `Upload id ${uploadId} not found.` };
    }

    if (res.data()?.userId != updatedData.userId) {
      throw {
        status: 403,
        message: `You do not have access to upload ${uploadId}.`,
      };
    }

    if (updatedData.filetype === FileType.PODCAST) {
      const duration = getAudioDurationInSeconds(updatedUpload.filepath);

      // Upload new file to cloud storage
      await PodcastsStorage.upload(updatedUpload.filepath, {
        destination: updatedData.filepath,
      });

      // Update in firestore
      updatedData.durationInMinutes = Math.round(await duration);
      await UploadsCollection.doc(uploadId)
        .update(updatedData)
        .catch(async (err: any) => {
          await PodcastsStorage.file(updatedData.filepath).delete();
          throw { status: err?.status || 500, message: err?.message || err };
        });

      // Delete old file from cloud storage
      await PodcastsStorage.file(oldFilepath).delete();

      return { status: "OK", message: "Your upload has been updated." };
    } else if (updatedData.filetype === FileType.IMAGE) {
      // Upload new file to cloud storage
      await ImagesStorage.upload(updatedUpload.filepath, {
        destination: updatedData.filepath,
      });

      // Update in firestore
      await UploadsCollection.doc(uploadId)
        .update(updatedData)
        .catch(async (err: any) => {
          await ImagesStorage.file(updatedData.filepath).delete();
          throw { status: err?.status || 500, message: err?.message || err };
        });

      // Delete old file from cloud storage
      await ImagesStorage.file(oldFilepath).delete();

      return { status: "OK", message: "Your upload has been updated." };
    } else {
      throw { status: 500, message: "Filetype not compatible." };
    }
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  } finally {
    fs.unlinkSync(updatedUpload.filepath);
  }
};

const deleteOneUpload = async (uploadId: string, userId: string) => {
  try {
    const res = await UploadsCollection.doc(uploadId).get();
    if (!res.exists) {
      throw { status: 404, message: `Upload id ${uploadId} not found.` };
    }

    const filepath = res.data()?.filepath;
    if (filepath == undefined) {
      throw { status: 404, message: `Upload id ${uploadId} not found.` };
    }

    if (res.data()?.userId != userId) {
      throw {
        status: 403,
        message: `You do not have access to upload ${uploadId}.`,
      };
    }

    // Delete from cloud storage
    await PodcastsStorage.file(filepath).delete();

    // Delete from firestore
    await UploadsCollection.doc(uploadId).delete();

    return { status: "OK", message: "Your upload has been deleted." };
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

export default {
  postOneUpload,
  updateOneUpload,
  deleteOneUpload,
};
