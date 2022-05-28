import { NextFunction, Request, Response } from "express";
import { FileType } from "../commons";

const formidable = require("formidable-serverless");

const uploadAudio = async (req: Request, res: Response, next: NextFunction) => {
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
    res.locals.filetype = FileType.PODCAST;

    next();
  });
};

const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  const form = await new formidable.IncomingForm();
  form.keepExtensions = true;
  form.maxFields = 1;
  await form.parse(req, function (err: any, fields: any, files: any) {
    // Check existence
    if (!files.image) {
      const err = {
        error: "Image file does not exist",
        status: 400,
        message: "Image file expected.",
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
    const image = files.image;
    const imageFileRegEx = new RegExp(/\.(png|jpg|jpeg|jiff)$/gi);
    const imageTypeRegEx = new RegExp(/^image\//gi);
    if (!imageFileRegEx.test(image.name) || !imageTypeRegEx.test(image.type)) {
      const err = {
        error: "Image format not in png or jpg",
        status: 400,
        message: "png or jpg file expected.",
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
    res.locals.imageFile = image;
    res.locals.filetype = FileType.IMAGE;

    next();
  });
};

export default { uploadAudio, uploadImage };
