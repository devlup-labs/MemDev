import express from "express";
import { postMemory, getMemoryDetail, searchMemory, getMemoryList, updateMemoryDetail } from "../controllers/memoryController.js";
import  authenticateToken  from "../middleware/authMiddleware.js";

const memoryRouter = express.Router();

memoryRouter.post("/", authenticateToken, postMemory);
memoryRouter.get("/", authenticateToken, getMemoryList)
memoryRouter.get("/:id", authenticateToken, getMemoryDetail);
memoryRouter.post("/search", authenticateToken, searchMemory);
memoryRouter.patch("/:id", authenticateToken, updateMemoryDetail);

export default memoryRouter;