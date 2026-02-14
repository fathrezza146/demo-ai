import cors from "cors";
import express from "express";
import { loadEnv } from "./config/env";
import authRoutes from "./routes/authRoutes";
import docsRoutes from "./routes/docsRoutes";
import healthRoutes from "./routes/healthRoutes";
import meRoutes from "./routes/meRoutes";

loadEnv();

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/auth", authRoutes);
app.use("/", meRoutes);
app.use("/docs", docsRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
