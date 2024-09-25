import mongoose from "mongoose";

const Post = new mongoose.Schema({
  name: { typeof: String, required: true },
  prompt: { typeof: String, required: true },
  photo: { typeof: String, required: true },
});

const Postschema = mongoose.model("Post", Post);

export default Postschema;
