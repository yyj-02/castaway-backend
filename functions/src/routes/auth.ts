import * as express from "express";
import authController from "../controllers/auth";
import AuthSchema from "./auth-schema";
import requestSchemaValidator from "../middlewares/requestSchemaValidator";

// Initializing
const router = express.Router();

// Endpoints for podcasts
router.post(
  "/login",
  AuthSchema.LoginSchema,
  requestSchemaValidator,
  authController.login
);

router.post(
  "/signup",
  AuthSchema.SignupSchema,
  requestSchemaValidator,
  authController.signup
);

router.delete("/:userId", authController.deleteAccount);

export default router;
