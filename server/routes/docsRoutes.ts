import { Request, Response, Router } from "express";
import swaggerUi from "swagger-ui-express";
import { getOpenApiSpec } from "../docs/openapi";

const router = Router();

router.get("/json", (req: Request, res: Response) => {
  const serverUrl = `${req.protocol}://${req.get("host")}`;
  return res.status(200).json(getOpenApiSpec(serverUrl));
});

router.use("/", swaggerUi.serve);
router.get("/", (req: Request, res: Response, next) => {
  const serverUrl = `${req.protocol}://${req.get("host")}`;
  const swaggerHtml = swaggerUi.setup(getOpenApiSpec(serverUrl), {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true
    }
  });

  return swaggerHtml(req, res, next);
});

export default router;
