import express from "express";
import * as dontenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import Post from "../mongodb/models/post.js";

dontenv.config();

const router = express.Router();

export default router;
