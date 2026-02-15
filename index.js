import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import note_routes from "./routes/note_route.js";
import cors from "cors";
dotenv.config();
const app = express();
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const port = process.env.PORT || 4001;


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Database connection error:", err));
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://note-taking-app-frontend-delta.vercel.app',
    'https://note-taking-app-frontend-ri1zoohcg-anila-atlas-projects.vercel.app',
  ],
  credentials: true,
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.get('/', (req, res) => {
    res.json({ message: 'EchoNote API is running!' });
});

app.get('/api/v1/noteapp', (req, res) => {
    res.json({ message: 'NoteApp API endpoints are working!' });
});
app.use("/api/v1/noteapp", note_routes);
app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});

