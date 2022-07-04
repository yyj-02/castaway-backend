import { header, body } from "express-validator";

const PostLivestreamSchema = [
  header("idToken")
    .isString()
    .withMessage("Id token must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Id token must not be empty."),

  body("title")
    .isString()
    .withMessage("Title must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Title must not be empty."),

  body("description")
    .isString()
    .withMessage("Description must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Description must not be empty."),
];

const DeleteLivestreamSchema = [
  header("idToken")
    .isString()
    .withMessage("Id token must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Id token must not be empty."),
];

export default {
  PostLivestreamSchema,
  DeleteLivestreamSchema,
};
