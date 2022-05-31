import axios from "axios";
import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import { FileType } from "../commons";

const formidable = require("formidable-serverless");

const idTokenToUserId = async (idToken: string) => {
  try {
    // Verifying id token
    const userData = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.IDENTITY_SERVER_API_KEY}`,
      { idToken }
    );
    const userId = userData.data.users[0].localId;

    return userId;
  } catch (err: any) {
    throw {
      status: err.status || 404,
      message: err.message || "Failed to get user id.",
    };
  }
};

const uploadAudio = async (req: Request, res: Response, next: NextFunction) => {
  const form = await new formidable.IncomingForm();
  form.keepExtensions = true;
  form.maxFields = 1;
  await form.parse(req, async function (err: any, fields: any, files: any) {
    // Check existence of idToken
    if (!fields.idToken) {
      const error = {
        error: "Id token does not exist",
        status: 400,
        message: "Id token expected.",
      };

      res.status(400).json(error);
      throw new Error(
        "Bad Request at " +
          req.method +
          " " +
          req.originalUrl +
          ":\n" +
          JSON.stringify(error)
      );
    } else if (fields.idToken.trim().length === 0) {
      const error = {
        error: "Id token cannot be empty",
        status: 400,
        message: "Id token expected.",
      };

      res.status(400).json(error);
      throw new Error(
        "Bad Request at " +
          req.method +
          " " +
          req.originalUrl +
          ":\n" +
          JSON.stringify(error)
      );
    }

    try {
      res.locals.userId = await idTokenToUserId(fields.idToken.trim());
    } catch (error: any) {
      res.status(400).json(error);
      throw new Error(
        "Bad Request at " +
          req.method +
          " " +
          req.originalUrl +
          ":\n" +
          JSON.stringify(error)
      );
    }

    // Check existence of podcast
    if (!files.podcast) {
      const error = {
        error: "Podcast file does not exist",
        status: 400,
        message: "Podcast file expected.",
      };

      res.status(400).json(error);
      throw new Error(
        "Bad Request at " +
          req.method +
          " " +
          req.originalUrl +
          ":\n" +
          JSON.stringify(error)
      );
    }

    // Check file type
    const podcast = files.podcast;
    const audioFileRegEx = new RegExp(/\.mp3$/gi);
    if (
      !audioFileRegEx.test(podcast.name) ||
      !(podcast.type === "audio/mpeg")
    ) {
      const error = {
        error: "Podcast format not in mp3",
        status: 400,
        message: "mp3 file expected",
      };

      res.status(400).json(error);
      throw new Error(
        "Bad Request at " +
          req.method +
          " " +
          req.originalUrl +
          ":\n" +
          JSON.stringify(error)
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
  await form.parse(req, async function (err: any, fields: any, files: any) {
    // Check existence of idToken
    if (!fields.idToken) {
      const error = {
        error: "Id token does not exist",
        status: 400,
        message: "Id token expected.",
      };

      res.status(400).json(error);
      throw new Error(
        "Bad Request at " +
          req.method +
          " " +
          req.originalUrl +
          ":\n" +
          JSON.stringify(error)
      );
    } else if (fields.idToken.trim().length === 0) {
      const error = {
        error: "Id token cannot be empty",
        status: 400,
        message: "Id token expected.",
      };

      res.status(400).json(error);
      throw new Error(
        "Bad Request at " +
          req.method +
          " " +
          req.originalUrl +
          ":\n" +
          JSON.stringify(error)
      );
    }

    try {
      res.locals.userId = await idTokenToUserId(fields.idToken.trim());
    } catch (error: any) {
      res.status(400).json(error);
      throw new Error(
        "Bad Request at " +
          req.method +
          " " +
          req.originalUrl +
          ":\n" +
          JSON.stringify(error)
      );
    }

    // Check existence of image
    if (!files.image) {
      const error = {
        error: "Image file does not exist",
        status: 400,
        message: "Image file expected.",
      };

      res.status(400).json(error);
      throw new Error(
        "Bad Request at " +
          req.method +
          " " +
          req.originalUrl +
          ":\n" +
          JSON.stringify(error)
      );
    }

    // Check file type
    const image = files.image;
    const imageFileRegEx = new RegExp(/\.(png|jpg|jpeg|jiff)$/gi);
    const imageTypeRegEx = new RegExp(/^image\//gi);
    if (!imageFileRegEx.test(image.name) || !imageTypeRegEx.test(image.type)) {
      const error = {
        error: "Image format not in png or jpg",
        status: 400,
        message: "png or jpg file expected.",
      };

      res.status(400).json(error);
      throw new Error(
        "Bad Request at " +
          req.method +
          " " +
          req.originalUrl +
          ":\n" +
          JSON.stringify(error)
      );
    }

    // Storing the file into locals
    res.locals.imageFile = image;
    res.locals.filetype = FileType.IMAGE;

    next();
  });
};

export default { uploadAudio, uploadImage };
