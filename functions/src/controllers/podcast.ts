import { Request, Response } from "express";
import Podcast from "../services/podcast";

const getAllPodcasts = async (req: Request, res: Response) => {
  try {
    const data = await Podcast.getAllPodcasts();
    res.json(data);
  } catch (err: any) {
    res
      .status(err?.status || 500)
      .json({ status: "FAILED", data: { error: err?.message || err } });
  }
};

const getOnePodcast = async (req: Request, res: Response) => {
  try {
    const {
      params: { podcastId },
    } = req;
    console.log(podcastId);
    const data = await Podcast.getOnePodcast(podcastId);
    res.json(data);
  } catch (err: any) {
    res
      .status(err?.status || 500)
      .json({ status: "FAILED", data: { error: err?.message || err } });
  }
};

const addOnePodcast = async (req: Request, res: Response) => {
  try {
    const { body } = req;
    const newPodcast = {
      title: body.title,
    };
    const data = await Podcast.addOnePodcast(newPodcast);
    res.json(data);
  } catch (err: any) {
    res
      .status(err?.status || 500)
      .json({ status: "FAILED", data: { error: err?.message || err } });
  }
};

const updateOnePodcast = async (req: Request, res: Response) => {
  try {
    const {
      body,
      params: { podcastId },
    } = req;
    const updatedPodcast = {
      title: body.title,
    };
    const data = await Podcast.updateOnePodcast(podcastId, updatedPodcast);
    res.json(data);
  } catch (err: any) {
    res
      .status(err?.status || 500)
      .json({ status: "FAILED", data: { error: err?.message || err } });
  }
};

const deleteOnePodcast = async (req: Request, res: Response) => {
  try {
    const {
      params: { podcastId },
    } = req;
    const data = await Podcast.deleteOnePodcast(podcastId);
    res.json(data);
  } catch (err: any) {
    res
      .status(err?.status || 500)
      .json({ status: "FAILED", data: { error: err?.message || err } });
  }
};

export default {
  getAllPodcasts,
  getOnePodcast,
  addOnePodcast,
  updateOnePodcast,
  deleteOnePodcast,
};
