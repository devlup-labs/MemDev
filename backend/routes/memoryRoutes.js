import express from "express";
import { getMemoryDetail, postMemory } from "../controllers/memoryController.js";
import { getMemoryList } from "../controllers/memoryController.js";
import  authenticateToken  from "../middleware/authMiddleware.js";

const memoryRouter = express.Router();

memoryRouter.post("/", authenticateToken, postMemory);
memoryRouter.get("/", authenticateToken, getMemoryList)
memoryRouter.get("/:id", authenticateToken, getMemoryDetail);

export default memoryRouter;