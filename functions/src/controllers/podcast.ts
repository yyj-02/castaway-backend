import { Request, Response } from "express";
import { Podcast } from "../commons";
import PodcastService from "../services/podcast";

const getAllPodcasts = async (req: Request, res: Response) => {
  try {
    const data = await PodcastService.getAllPodcasts();
    res.json(data);
  } catch (err: any) {
    res
      .status(err?.status || 500)
      .json({ status: "FAILED", data: { error: err?.message || err } });
  }
};

const getOnePodcast = async (req: Request, res: Response) => {
  const {
    params: { podcastId },
  } = req;

  try {
    const data = await PodcastService.getOnePodcast(podcastId);
    res.json(data);
  } catch (err: any) {
    res
      .status(err?.status || 500)
      .json({ status: "FAILED", data: { error: err?.message || err } });
  }
};

const addOnePodcast = async (req: Request, res: Response) => {
  const { body } = req;
  const newPodcast: Podcast = {
    title: body.title,
    description: body.description,
    durationInMinutes: 0,
    path: "empty",
    imgPath: "empty",
    artistId: "Sample Artist",
    genres: body.genres,
    public: body.public,
  };

  try {
    const data = await PodcastService.addOnePodcast(newPodcast);
    res.json(data);
  } catch (err: any) {
    res
      .status(err?.status || 500)
      .json({ status: "FAILED", data: { error: err?.message || err } });
  }
};

const updateOnePodcast = async (req: Request, res: Response) => {
  const {
    body,
    params: { podcastId },
  } = req;
  const updatedPodcast = {
    title: body.title,
    description: body.description,
    durationInMinutes: 0,
    path: "empty",
    imgPath: "empty",
    artistId: "Sample Artist",
    genres: body.genres,
    public: body.public,
  };

  try {
    const data = await PodcastService.updateOnePodcast(
      podcastId,
      updatedPodcast
    );
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

    const data = await PodcastService.deleteOnePodcast(podcastId);
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
