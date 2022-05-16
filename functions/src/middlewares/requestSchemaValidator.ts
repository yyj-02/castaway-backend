import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

const requestSchemaValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    res.status(400).json({ errors: err.array() });
    throw new Error(
      "Bad Request at " +
        req.method +
        " " +
        req.originalUrl +
        ":\n" +
        JSON.stringify(err)
    );
  }

  next();
};

export default requestSchemaValidator;
