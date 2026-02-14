import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../config/db";
import { env } from "../config/env";
import type { AuthenticatedRequest } from "../middleware/authMiddleware";
import { sendError, sendOk } from "../utils/http";

interface LoginRequestBody {
  email?: string;
}

interface UserWithRoleRow {
  user_id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  user_created_at: string;
  user_updated_at: string;
  role_id: string;
  role_name: string;
  role_description: string | null;
  role_created_at: string;
}

const findUserByEmailQuery = `
  SELECT
    u.id AS user_id,
    u.email,
    u.full_name,
    u.is_active,
    u.created_at AS user_created_at,
    u.updated_at AS user_updated_at,
    r.id AS role_id,
    r.role_name,
    r.description AS role_description,
    r.created_at AS role_created_at
  FROM users u
  INNER JOIN roles r ON r.id = u.role_id
  WHERE LOWER(u.email) = LOWER($1)
  LIMIT 1
`;

const findUserByIdQuery = `
  SELECT
    u.id AS user_id,
    u.email,
    u.full_name,
    u.is_active,
    u.created_at AS user_created_at,
    u.updated_at AS user_updated_at,
    r.id AS role_id,
    r.role_name,
    r.description AS role_description,
    r.created_at AS role_created_at
  FROM users u
  INNER JOIN roles r ON r.id = u.role_id
  WHERE u.id = $1
  LIMIT 1
`;

const formatUserWithRole = (userRow: UserWithRoleRow) => {
  return {
    id: Number(userRow.user_id),
    email: userRow.email,
    fullName: userRow.full_name,
    isActive: userRow.is_active,
    createdAt: userRow.user_created_at,
    updatedAt: userRow.user_updated_at,
    role: {
      id: Number(userRow.role_id),
      name: userRow.role_name,
      description: userRow.role_description,
      createdAt: userRow.role_created_at
    }
  };
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email } = req.body as LoginRequestBody;

  if (!email || typeof email !== "string" || !email.trim()) {
    return sendError(res, 400, "email is required");
  }

  const normalizedEmail = email.trim();
  const jwtSecret = env.jwtSecret;

  if (!jwtSecret) {
    return sendError(res, 500, "JWT_SECRET is not configured");
  }

  try {
    const queryResult = await pool.query<UserWithRoleRow>(findUserByEmailQuery, [
      normalizedEmail
    ]);

    if (queryResult.rowCount === 0) {
      return sendError(res, 404, "email not found");
    }

    const userRow = queryResult.rows[0];

    const token = jwt.sign(
      {
        sub: userRow.user_id,
        email: userRow.email,
        role: userRow.role_name
      },
      jwtSecret,
      { expiresIn: "1d" }
    );

    return sendOk(res, {
      token,
      user: formatUserWithRole(userRow)
    });
  } catch (error) {
    console.error("login error:", error);
    return sendError(res, 500, "failed to login");
  }
};

export const me = async (req: Request, res: Response): Promise<Response> => {
  const authUser = (req as AuthenticatedRequest).authUser;

  if (!authUser) {
    return sendError(res, 401, "Unauthorized");
  }

  try {
    const queryResult = await pool.query<UserWithRoleRow>(findUserByIdQuery, [
      authUser.userId
    ]);

    if (queryResult.rowCount === 0) {
      return sendError(res, 404, "user not found");
    }

    return sendOk(res, {
      user: formatUserWithRole(queryResult.rows[0])
    });
  } catch (error) {
    console.error("me error:", error);
    return sendError(res, 500, "failed to fetch profile");
  }
};
