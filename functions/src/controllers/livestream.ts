import { Request, Response } from "express";
import { Livestream } from "../commons";
import livestreamService from "../services/livestream";

const getAllLivestream = async (req: Request, res: Response) => {
  try {
    const data = await livestreamService.getAllLivestream();
    res.json(data);
  } catch (err: any) {
    res
      .status(err?.status || 500)
      .json({ status: "FAILED", data: { error: err?.message || err } });
  }
};

const addOneLivestream = async (req: Request, res: Response) => {
  const { body } = req;
  const {
    locals: { userId },
  } = res;
  const newLivestream: Livestream = {
    title: body.title,
    description: body.description,
    artistId: userId,
    artistName: "",
    streamerConnected: false,
  };

  try {
    const data = await livestreamService.addOneLivestream(newLivestream);
    res.json(data);
  } catch (err: any) {
    res
      .status(err?.status || 500)
      .json({ status: "FAILED", data: { error: err?.message || err } });
  }
};

const deleteOneLivestream = async (req: Request, res: Response) => {
  const {
    body: { livestreamId },
  } = req;
  const {
    locals: { userId },
  } = res;

  try {
    const data = await livestreamService.deleteOneLivestream(
      livestreamId,
      userId
    );
    res.json(data);
  } catch (err: any) {
    res
      .status(err?.status || 500)
      .json({ status: "FAILED", data: { error: err?.message || err } });
  }
};

export default {
  getAllLivestream,
  addOneLivestream,
  deleteOneLivestream,
};
