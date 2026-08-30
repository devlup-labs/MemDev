import express from "express";
import { postMemory } from "../controllers/memoryController.js";
import  authenticateToken  from "../middleware/authMiddleware.js";

const memoryRouter = express.Router();

memoryRouter.post("/", authenticateToken, postMemory);

export default memoryRouter;