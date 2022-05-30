import { check } from "express-validator";

const LoginSchema = [
  check("email")
    .isEmail()
    .withMessage("Email must be a valid email address.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Email must not be empty."),

  check("password")
    .isString()
    .withMessage("Password must be a string.")
    .bail()
    .notEmpty()
    .withMessage("Password must not be empty.")
    .bail()
    .isStrongPassword()
    .withMessage("Please use a stronger password."),
];

const SignupSchema = [
  check("email")
    .isEmail()
    .withMessage("Email must be a valid email address.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Email must not be empty."),

  check("displayName")
    .isString()
    .withMessage("Display name must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Display name must not be empty."),

  check("password")
    .isString()
    .withMessage("Password must be a string.")
    .bail()
    .notEmpty()
    .withMessage("Password must not be empty.")
    .bail()
    .isStrongPassword()
    .withMessage("Please use a stronger password."),
];

export default {
  LoginSchema,
  SignupSchema,
};
