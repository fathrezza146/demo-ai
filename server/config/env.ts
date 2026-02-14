import dotenv from "dotenv";

dotenv.config();

const toNumber = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  port: toNumber(process.env.PORT, 5000),
  jwtSecret: process.env.JWT_SECRET || "",
  db: {
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    name: process.env.DB_NAME || "demo_db",
    password: process.env.DB_PASSWORD || "postgres",
    port: toNumber(process.env.DB_PORT, 5432)
  }
};
