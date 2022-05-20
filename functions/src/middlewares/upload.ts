import { NextFunction, Request, Response } from "express";

const formidable = require("formidable-serverless");

const upload = async (req: Request, res: Response, next: NextFunction) => {
  const form = await new formidable.IncomingForm();
  form.keepExtensions = true;
  form.maxFields = 1;
  await form.parse(req, function (err: any, fields: any, files: any) {
    // Check existence
    if (!files.podcast) {
      const err = {
        error: "Podcast file does not exist",
        status: 400,
        message: "Podcast file expected.",
      };

      res.status(400).json(err);
      throw new Error(
        "Bad Request at " +
          req.method +
          " " +
          req.originalUrl +
          ":\n" +
          JSON.stringify(err)
      );
    }

    // Check file type
    const podcast = files.podcast;
    const audioFileRegEx = new RegExp(/\.mp3$/gi);
    if (
      !audioFileRegEx.test(podcast.name) ||
      !(podcast.type === "audio/mpeg")
    ) {
      const err = {
        error: "Podcast format not in mp3",
        status: 400,
        message: "mp3 file expected",
      };

      res.status(400).json(err);
      throw new Error(
        "Bad Request at " +
          req.method +
          " " +
          req.originalUrl +
          ":\n" +
          JSON.stringify(err)
      );
    }

    // Storing the file into locals
    res.locals.podcastFile = podcast;

    next();
  });
};

export default upload;
