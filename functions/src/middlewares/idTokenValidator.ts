import axios from "axios";
import { NextFunction, Request, Response } from "express";

const idTokenValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    body: { idToken },
  } = req;

  if (idToken != undefined) {
    try {
      // Verifying id token
      const userData = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.IDENTITY_SERVER_API_KEY}`,
        { idToken }
      );
      const userId = userData.data.users[0].localId;

      // Passing the user id to the next function
      res.locals.userId = userId;
    } catch (err: any) {
      res.json({
        status: err.status || 404,
        message: err.message || "User not found.",
      });
      throw {
        status: err.status || 404,
        message: err.message || "User not found.",
      };
    }
  } else {
    res.locals.userId = "";
  }

  next();
};

export default idTokenValidator;
