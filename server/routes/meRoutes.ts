import { Router } from "express";
import { me } from "../controller/authController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/me", authenticateToken, me);

export default router;
