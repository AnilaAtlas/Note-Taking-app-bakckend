import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import note_routes from "./routes/note_route.js";
import cors from "cors";
dotenv.config();

const app = express();
const port = process.env.PORT || 4001;

// EXTENSIVE LOGGING - Add this at the very top
console.log("🚀 Server starting...");
console.log("📝 Environment:", process.env.NODE_ENV);
console.log("🔌 Port:", port);
console.log("📦 MongoDB URI:", process.env.MONGO_URI ? "✅ Set" : "❌ Missing");

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://note-taking-app-frontend-delta.vercel.app',
  'https://note-taking-app-frontend-ri1zoohcg-anila-atlas-projects.vercel.app',
  'https://note-taking-app-frontend-ebqc6bf2p-anila-atlas-projects.vercel.app' 
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("🌐 Incoming origin:", origin);
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('❌ Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-ID'],
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Changed from '/' to '*'
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection with better logging
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ Database connection error:", err));

// Log all requests
app.use((req, res, next) => {
  console.log(`\n📨 ${new Date().toISOString()}`);
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', {
    'x-session-id': req.headers['x-session-id'],
    'content-type': req.headers['content-type'],
    'origin': req.headers.origin
  });
  console.log('Body:', req.body);
  next();
});

// TEST ROUTES - Add these to verify routing works
app.get('/', (req, res) => {
  console.log("✅ Root route accessed");
  res.json({ 
    message: 'EchoNote API is running!',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.get('/test', (req, res) => {
  res.json({ message: 'Test route works!' });
});

// API routes
app.use("/api/v1/noteapp", note_routes);

// Debug route to see all registered routes
app.get('/debug/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach(handler => {
        if (handler.route) {
          routes.push({
            path: '/api/v1/noteapp' + handler.route.path,
            methods: Object.keys(handler.route.methods)
          });
        }
      });
    }
  });
  res.json(routes);
});

// 404 handler - This will catch any unhandled routes
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ 
    error: 'Route not found', 
    method: req.method,
    path: req.url,
    message: `Cannot ${req.method} ${req.url}`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(' Error:', err);
  res.status(err.status || 500).json({
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(port, () => {
  console.log(`✅ Server is running on port: ${port}`);
  console.log('🌍 Allowed origins:', allowedOrigins);
});