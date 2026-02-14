import { Response } from "express";

export const sendOk = (res: Response, data: unknown): Response => {
  return res.status(200).json(data);
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string
): Response => {
  return res.status(statusCode).json({
    error: {
      message
    }
  });
};
