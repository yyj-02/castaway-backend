import { Request, Response } from "express";
import streamService from "../services/stream";

const streamOnePodcast = async (req: Request, res: Response) => {
  const {
    params: { podcastId },
  } = req;

  try {
    const data = await streamService.streamOnePodcast(podcastId);
    res.json(data);
  } catch (err: any) {
    res
      .status(err?.status || 500)
      .json({ status: "FAILED", data: { error: err?.message || err } });
  }
};

export default {
  streamOnePodcast,
};
