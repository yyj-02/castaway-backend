import { GetSignedUrlConfig } from "@google-cloud/storage";
import { PodcastsStorage } from "../database/db";

export const generateV4ReadSignedUrlOneMinute = async (fileName: string) => {
  // These options will allow temporary read access to the file
  const options: GetSignedUrlConfig = {
    action: "read",
    expires: Date.now() + 1 * 60 * 1000,
    version: "v4",
  };

  // Get a v4 signed URL for reading the file
  const [url] = await PodcastsStorage.file(fileName).getSignedUrl(options);

  console.log(url);
  return url;
};
