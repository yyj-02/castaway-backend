import * as express from "express";
import userController from "../controllers/user";
import UserSchema from "./user-schema";
import requestSchemaValidator from "../middlewares/requestSchemaValidator";
import idTokenValidator from "../middlewares/idTokenValidator-old";

// Initializing
const router = express.Router();

// Endpoints
router.post(
  "/info",
  UserSchema.IdTokenSchema,
  requestSchemaValidator,
  idTokenValidator,
  userController.getProfile
);

router.put(
  "/displayName",
  UserSchema.ChangeDisplayNameSchema,
  requestSchemaValidator,
  idTokenValidator,
  userController.changeDisplayName
);

router.post(
  "/creations",
  UserSchema.IdTokenSchema,
  requestSchemaValidator,
  idTokenValidator,
  userController.getAllCreations
);

router.post(
  "/favorites",
  UserSchema.IdTokenSchema,
  requestSchemaValidator,
  idTokenValidator,
  userController.getAllFavorites
);

router.put(
  "/favorites",
  UserSchema.UpdateFavoritesSchema,
  requestSchemaValidator,
  idTokenValidator,
  userController.addFavorite
);

router.delete(
  "/favorites",
  UserSchema.UpdateFavoritesSchema,
  requestSchemaValidator,
  idTokenValidator,
  userController.deleteFavorite
);

router.post(
  "/messagingToken",
  UserSchema.RegisterMessagingTokenSchema,
  requestSchemaValidator,
  idTokenValidator,
  userController.registerMessagingToken
);

export default router;
