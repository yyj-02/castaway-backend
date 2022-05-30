import { Request, Response } from "express";
import authService from "../services/auth";

const login = async (req: Request, res: Response) => {
  const {
    body: { email, password },
  } = req;

  try {
    const data = await authService.login({ email, password });
    res.json(data);
  } catch (err: any) {
    res
      .status(err?.status || 500)
      .json({ status: "FAILED", data: { error: err?.message || err } });
  }
};

const signup = async (req: Request, res: Response) => {
  const {
    body: { email, displayName, password },
  } = req;

  try {
    const data = await authService.signup({ email, displayName, password });
    res.json(data);
  } catch (err: any) {
    res
      .status(err?.status || 500)
      .json({ status: "FAILED", data: { error: err?.message || err } });
  }
};

const deleteAccount = async (req: Request, res: Response) => {
  const {
    params: { userId },
  } = req;

  try {
    const data = await authService.deleteAccount(userId);
    res.json(data);
  } catch (err: any) {
    res
      .status(err?.status || 500)
      .json({ status: "FAILED", data: { error: err?.message || err } });
  }
};

export default {
  login,
  signup,
  deleteAccount,
};
