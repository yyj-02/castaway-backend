import { Request, Response } from "express";
import { Podcast } from "../commons";
import podcastService from "../services/podcast";

const getAllPodcasts = async (req: Request, res: Response) => {
  try {
    const data = await podcastService.getAllPodcasts();
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
    const data = await podcastService.getOnePodcast(podcastId);
    res.json(data);
  } catch (err: any) {
    res
      .status(err?.status || 500)
      .json({ status: "FAILED", data: { error: err?.message || err } });
  }
};

const addOnePodcast = async (req: Request, res: Response) => {
  const { body } = req;
  const { podcastUploadId, imageUploadId } = body;
  const {
    locals: { userId },
  } = res;
  const newPodcast: Podcast = {
    title: body.title,
    description: body.description,
    durationInMinutes: 0,
    path: "empty",
    imgPath: "empty",
    artistId: userId,
    genres: body.genres,
    public: body.public,
  };

  try {
    const data = await podcastService.addOnePodcast(
      podcastUploadId,
      imageUploadId,
      newPodcast
    );
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
    path: "",
    imgPath: "",
    artistId: "",
    genres: body.genres,
    public: body.public,
  };

  try {
    const data = await podcastService.updateOnePodcast(
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

const updateOnePodcastAudio = async (req: Request, res: Response) => {
  const {
    body: { updatedPodcastUploadId },
    params: { podcastId },
  } = req;

  try {
    const data = await podcastService.updateOnePodcastAudio(
      podcastId,
      updatedPodcastUploadId
    );
    res.json(data);
  } catch (err: any) {
    res
      .status(err?.status || 500)
      .json({ status: "FAILED", data: { error: err?.message || err } });
  }
};

const updateOnePodcastImage = async (req: Request, res: Response) => {
  const {
    body: { updatedImageUploadId },
    params: { podcastId },
  } = req;

  try {
    const data = await podcastService.updateOnePodcastImage(
      podcastId,
      updatedImageUploadId
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

    const data = await podcastService.deleteOnePodcast(podcastId);
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
  updateOnePodcastAudio,
  updateOnePodcastImage,
  deleteOnePodcast,
};
