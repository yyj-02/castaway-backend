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

export default { IdTokenSchema };
