import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { sendError } from "../utils/http";

interface TokenPayload extends JwtPayload {
  email?: string;
  role?: string;
}

export interface AuthenticatedRequest extends Request {
  authUser?: {
    userId: number;
    email?: string;
    role?: string;
  };
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return sendError(res, 401, "Authorization token is required");
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return sendError(res, 401, "Authorization format must be Bearer <token>");
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return sendError(res, 500, "JWT_SECRET is not configured");
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    if (typeof decoded === "string") {
      return sendError(res, 401, "Invalid token payload");
    }

    const payload = decoded as TokenPayload;
    const userId = Number(payload.sub);

    if (!Number.isInteger(userId) || userId <= 0) {
      return sendError(res, 401, "Invalid token payload");
    }

    (req as AuthenticatedRequest).authUser = {
      userId,
      email: typeof payload.email === "string" ? payload.email : undefined,
      role: typeof payload.role === "string" ? payload.role : undefined
    };

    next();
  } catch (_error) {
    return sendError(res, 401, "Invalid or expired token");
  }
};
