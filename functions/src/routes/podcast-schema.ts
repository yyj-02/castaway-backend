import { check } from "express-validator";

const PostSchema = [
  check("uploadId")
    .isString()
    .withMessage("Upload id must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Upload id must not be empty."),

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

const UpdateSchema = [
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

export default {
  PostSchema,
  UpdateSchema,
};
