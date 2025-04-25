import maintainanceRouter from "./maintainance/index.js";
import express from "express";

const router = express.Router();

router.use("/maintainance", maintainanceRouter);

export default router;
