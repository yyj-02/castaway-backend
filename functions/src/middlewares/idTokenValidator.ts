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

  try {
    // Verifying id token
    const userData = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.IDENTITY_SERVER_API_KEY}`,
      { idToken }
    );
    const userId = userData.data.users[0].localId;

    // Passing the user id to the next function
    res.locals.userId = userId;

    next();
  } catch (err: any) {
    throw {
      status: err.status || 404,
      message: err.message || "Failed to get user id.",
    };
  }
};

export default idTokenValidator;
