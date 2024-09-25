import express from "express";
import * as dotenv from "dotenv";
import OpenAI from "openai";
import fs from "node:fs";
import axios from "axios";
import FormData from "form-data";

dotenv.config();

const router = express.Router();


router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;

    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('output_format', 'jpeg');

    const response = await axios.post(
      'https://api.stability.ai/v2beta/stable-image/generate/sd3',
      formData,
      {
        validateStatus: undefined,
        responseType: 'arraybuffer',
        headers: { 
          Authorization: `Bearer ${process.env.STABILITY_AI_API_KEY}`, 
          Accept: 'image/*',
          ...formData.getHeaders(),
        },
      }
    );

    if (response.status === 200) {
      const base64Image = Buffer.from(response.data).toString('base64');
      res.json({ photo: base64Image }); // Send the base64 image in a JSON response
    } else {
      throw new Error(`${response.status}: ${response.data.toString()}`);
    }

  } catch (error) {
    console.error(error);
    const errorMessage = error.response?.data?.error?.message || error.message || "Something went wrong";
    res.status(500).send(errorMessage);
  }
});


export default router;
