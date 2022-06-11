import { GetSignedUrlConfig } from "@google-cloud/storage";
import { ImagesStorage, PodcastsStorage } from "../database/db";

export const generateV4ReadSignedUrlOneMinute = async (fileName: string) => {
  try {
    // These options will allow temporary read access to the file
    const options: GetSignedUrlConfig = {
      action: "read",
      expires: Date.now() + 1 * 60 * 1000,
      version: "v4",
    };

    // Get a v4 signed URL for reading the file
    const [url] = await PodcastsStorage.file(fileName).getSignedUrl(options);

    return url;
  } catch (err: any) {
    throw {
      status: err.status || 500,
      message: err.message || "Failed to generate stream link.",
    };
  }
};

export const generateV4ReadSignedUrlOneHour = async (fileName: string) => {
  try {
    // These options will allow temporary read access to the file
    const options: GetSignedUrlConfig = {
      action: "read",
      expires: Date.now() + 60 * 60 * 1000,
      version: "v4",
    };

    // Get a v4 signed URL for reading the file
    const [url] = await ImagesStorage.file(fileName).getSignedUrl(options);

    return url;
  } catch (err: any) {
    throw {
      status: err.status || 500,
      message: err.message || "Failed to generate stream link.",
    };
  }
};
