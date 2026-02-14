import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import note_routes from "./routes/note_route.js";
import cors from "cors";
dotenv.config();
const app = express();
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const port = process.env.PORT || 4002;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Database connection error:", err));
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://note-taking-app-frontend-delta.vercel.app' 
  ],
  credentials: true
}));
app.use(express.json());
app.use("/api/v1/noteapp", note_routes);
app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
