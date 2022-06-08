import { Request, Response } from "express";
import userService from "../services/user";

const getProfile = async (req: Request, res: Response) => {
  const {
    locals: { userId },
  } = res;

  try {
    const data = userService.getProfile(userId);
    res.json(data);
  } catch (err: any) {
    res
      .status(err?.status || 500)
      .json({ status: "FAILED", data: { error: err?.message || err } });
  }
};

const changeDisplayName = async (req: Request, res: Response) => {
  const {
    locals: { userId },
  } = res;
  const {
    body: { updatedDisplayName },
  } = req;

  try {
    const data = userService.changeDisplayName(userId, updatedDisplayName);
    res.json(data);
  } catch (err: any) {
    res
      .status(err?.status || 500)
      .json({ status: "FAILED", data: { error: err?.message || err } });
  }
};

const getAllCreations = async (req: Request, res: Response) => {
  const {
    locals: { userId },
  } = res;

  try {
    const data = userService.getAllCreations(userId);
    res.json(data);
  } catch (err: any) {
    res
      .status(err?.status || 500)
      .json({ status: "FAILED", data: { error: err?.message || err } });
  }
};

const getAllFavorites = async (req: Request, res: Response) => {
  const {
    locals: { userId },
  } = res;

  try {
    const data = userService.getAllFavorites(userId);
    res.json(data);
  } catch (err: any) {
    res
      .status(err?.status || 500)
      .json({ status: "FAILED", data: { error: err?.message || err } });
  }
};

const addFavorite = async (req: Request, res: Response) => {
  const {
    locals: { userId },
  } = res;
  const {
    body: { podcastId },
  } = req;

  try {
    const data = userService.addFavorite(userId, podcastId);
    res.json(data);
  } catch (err: any) {
    res
      .status(err?.status || 500)
      .json({ status: "FAILED", data: { error: err?.message || err } });
  }
};

const deleteFavorite = async (req: Request, res: Response) => {
  const {
    locals: { userId },
  } = res;
  const {
    body: { podcastId },
  } = req;

  try {
    const data = userService.deleteFavorite(userId, podcastId);
    res.json(data);
  } catch (err: any) {
    res
      .status(err?.status || 500)
      .json({ status: "FAILED", data: { error: err?.message || err } });
  }
};

export default {
  getProfile,
  changeDisplayName,
  getAllCreations,
  getAllFavorites,
  addFavorite,
  deleteFavorite,
};
