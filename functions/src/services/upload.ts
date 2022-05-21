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

    // Uploading to cloud storage
    await PodcastsStorage.upload(filepath, {
      destination: data.filepath,
    });

    // Recording in firestore
    data.durationInMinutes = Math.round(await duration);
    const res = await UploadsCollection.add(data);

    return { uploadId: res.id };
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  } finally {
    fs.unlinkSync(filepath);
  }
};

export default {
  postOneUpload,
};
