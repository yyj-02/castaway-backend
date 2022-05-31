import { NextFunction, Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";

const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    body: { idToken },
  } = req;

  try {
    // Verifying id token
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

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

export default validateToken;
