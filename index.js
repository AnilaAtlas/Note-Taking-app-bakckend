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

const allowedOrigins = [
  'http://localhost:5173',
  'https://note-taking-app-frontend-delta.vercel.app',
  'https://note-taking-app-frontend-ri1zoohcg-anila-atlas-projects.vercel.app',
  'https://note-taking-app-frontend-ebqc6bf2p-anila-atlas-projects.vercel.app' 
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-ID'],
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));
app.options('/', cors(corsOptions));
app.use(express.json());

app.post('/createnote', (req, res) => {
  res.redirect(307, '/api/v1/noteapp/createnote');
});

app.get('/getnotes', (req, res) => {
  res.redirect(307, '/api/v1/noteapp/getnotes');
});
app.get('/', (req, res) => {
  res.json({ message: 'EchoNote API is running!' });
});

app.get('/api/v1/noteapp', (req, res) => {
  res.json({ message: 'NoteApp API endpoints are working!' });
});

app.use("/api/v1/noteapp", note_routes);
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Origin: ${req.headers.origin || 'No origin'}`);
  next();
});

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
  console.log('Allowed origins:', allowedOrigins);
});

// Add this temporarily to see all registered routes
app.get('/debug/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    }
  });
  res.json(routes);
});