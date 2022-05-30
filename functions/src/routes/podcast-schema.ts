import { check } from "express-validator";

const PostPodcastSchema = [
  check("podcastUploadId")
    .isString()
    .withMessage("Podcast upload id must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Podcast upload id must not be empty."),

  check("imageUploadId")
    .isString()
    .withMessage("Image upload id must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Image upload id must not be empty."),

  check("title")
    .isString()
    .withMessage("Title must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Title must not be empty."),

  check("description")
    .isString()
    .withMessage("Description must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Description must not be empty."),

  check("genres")
    .isArray({ min: 1 })
    .withMessage("Genres must be an array containing at least one genre."),

  check("public").isBoolean().withMessage("Public must be a boolean."),
];

const UpdatePodcastSchema = [
  check("title")
    .isString()
    .withMessage("Title must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Title must not be empty."),

  check("description")
    .isString()
    .withMessage("Description must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Description must not be empty."),

  check("genres")
    .isArray({ min: 1 })
    .withMessage("Genres must be an array containing at least one genre."),

  check("public").isBoolean().withMessage("Public must be a boolean."),
];

const UpdateAudioSchema = [
  check("updatedPodcastUploadId")
    .isString()
    .withMessage("Podcast upload id must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Podcast upload id must not be empty."),
];

const UpdateImageSchema = [
  check("updatedImageUploadId")
    .isString()
    .withMessage("Image upload id must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Image upload id must not be empty."),
];

export default {
  PostPodcastSchema,
  UpdatePodcastSchema,
  UpdateAudioSchema,
  UpdateImageSchema,
};
