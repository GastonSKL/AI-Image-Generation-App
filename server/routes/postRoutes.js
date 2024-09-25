import express from "express";
import * as dontenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import Post from "../mongodb/models/post.js";

dontenv.config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.route("/").get(async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.route("/").post(async (req, res) => {
  try {
    const { name, prompt, photo } = req.body;

    // Strip the base64 prefix before uploading
    const base64Image = photo.split(",")[1]; // Get the actual base64 part

    // Upload the image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64Image}`, {
      resource_type: 'auto', // Automatically handle the type
      public_id: name.replace(/\s+/g, '_'), // Optional: Use name as the public ID
    });

    const newPost = await Post.create({
      name,
      prompt,
      photo: uploadResult.secure_url, // Use secure_url for HTTPS link
    });

    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
