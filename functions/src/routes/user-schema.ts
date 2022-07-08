import { check } from "express-validator";

const IdTokenSchema = [
  check("idToken")
    .isString()
    .withMessage("Id token must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Id token must not be empty."),
];

const ChangeDisplayNameSchema = [
  check("idToken")
    .isString()
    .withMessage("Id token must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Id token must not be empty."),

  check("updatedDisplayName")
    .isString()
    .withMessage("Updated display name must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Updated display name must not be empty."),
];

const UpdateFavoritesSchema = [
  check("idToken")
    .isString()
    .withMessage("Id token must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Id token must not be empty."),

  check("podcastId")
    .isString()
    .withMessage("Podcast id must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Podcast id must not be empty."),
];

const RegisterMessagingTokenSchema = [
  check("idToken")
    .isString()
    .withMessage("Id token must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Id token must not be empty."),

  check("messagingToken")
    .isString()
    .withMessage("Messaging token must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Messaging token must not be empty."),
];

export default {
  IdTokenSchema,
  ChangeDisplayNameSchema,
  UpdateFavoritesSchema,
  RegisterMessagingTokenSchema,
};
