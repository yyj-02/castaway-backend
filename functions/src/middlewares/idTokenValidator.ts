import axios from "axios";
import { NextFunction, Request, Response } from "express";

const idTokenValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    headers: { idtoken },
  } = req;

  if (idtoken == undefined) {
    res.locals.userId = "";
    next();
  }

  try {
    // Verifying id token
    const userData = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.IDENTITY_SERVER_API_KEY}`,
      { idToken: idtoken }
    );
    const userId = userData.data.users[0].localId;

    // Passing the user id to the next function
    res.locals.userId = userId;
  } catch (err: any) {
    res.json({
      status: 400,
      message: "User not found.",
    });
    throw {
      status: 400,
      message: "User not found.",
    };
  }

  next();
};

export default idTokenValidator;
