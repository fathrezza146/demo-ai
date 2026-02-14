import { Request, Response } from "express";
import { sendOk } from "../utils/http";

export const healthCheck = (_req: Request, res: Response): Response => {
  return sendOk(res, {
    status: "ok",
    message: "Server is up",
    timestamp: new Date().toISOString()
  });
};
