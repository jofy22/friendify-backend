import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

// Add Cross-Origin-Opener-Policy and Cross-Origin-Embedder-Policy headers
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups'); // Allow popups
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp'); // Allow embedding of resources from the same origin
  next();
});

// Enable CORS
app.use(cors());

// Routes
app.use('/posts', postRoutes);
app.use('/user', userRoutes)

// Database connection
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server running on port: ${PORT}`)
    )
  )
  .catch((error) => console.error('Connection error:', error));

