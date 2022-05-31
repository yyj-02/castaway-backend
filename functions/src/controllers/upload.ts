import { Request, Response } from "express";
import { FileType, Upload } from "../commons";
import uploadService from "../services/upload";

const postOneUpload = async (req: Request, res: Response) => {
  const {
    locals: { filetype, userId },
  } = res;

  const file =
    filetype === FileType.PODCAST
      ? res.locals.podcastFile
      : filetype === FileType.IMAGE
      ? res.locals.imageFile
      : undefined;

  if (file === undefined) {
    res
      .status(500)
      .json({ status: "FAILED", data: { error: "Problem with filetype." } });
  }

  const newUpload: Upload = {
    userId,
    filepath: file.path,
    filetype,
  };

  try {
    const data = await uploadService.postOneUpload(newUpload);
    res.json(data);
  } catch (err: any) {
    res
      .status(err?.status || 500)
      .json({ status: "FAILED", data: { error: err?.message || err } });
  }
};

const updateOneUpload = async (req: Request, res: Response) => {
  const {
    params: { uploadId },
  } = req;

  const {
    locals: { filetype, userId },
  } = res;

  const file =
    filetype === FileType.PODCAST
      ? res.locals.podcastFile
      : filetype === FileType.IMAGE
      ? res.locals.imageFile
      : undefined;

  if (file === undefined) {
    res
      .status(500)
      .json({ status: "FAILED", data: { error: "Problem with filetype." } });
  }

  const updatedUpload: Upload = {
    userId,
    filepath: file.path,
    filetype,
  };

  try {
    const data = await uploadService.updateOneUpload(uploadId, updatedUpload);
    res.json(data);
  } catch (err: any) {
    res
      .status(err?.status || 500)
      .json({ status: "FAILED", data: { error: err?.message || err } });
  }
};

const deleteOneUpload = async (req: Request, res: Response) => {
  const {
    params: { uploadId },
  } = req;

  const {
    locals: { userId },
  } = res;

  try {
    const data = await uploadService.deleteOneUpload(uploadId, userId);
    res.json(data);
  } catch (err: any) {
    res
      .status(err?.status || 500)
      .json({ status: "FAILED", data: { error: err?.message || err } });
  }
};

export default {
  postOneUpload,
  updateOneUpload,
  deleteOneUpload,
};
