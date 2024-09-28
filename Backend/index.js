import express from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client'; // Note: Fixed import statement
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url'; // Importing fileURLToPath

const app = express();
const port = 5172;

// Importing route modules
import userRoutes from './Routes/userRoutes.js';
import wardrobeItemsRoutes from './Routes/wardrobeItemsRoutes.js';
import itemTagsRoutes from './Routes/itemTagsRoutes.js';
import outfitsRoutes from './Routes/outfitsRoutes.js';
import marketPlaceRoutes from './Routes/marketPlaceRoutes.js'
// Middleware
app.use(cors());
app.use(express.json());

// Define __dirname using fileURLToPath
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serving static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log(`Serving static files from: ${path.join(__dirname, 'uploads/products')}`);

// Defining routes
app.use('/api/user', userRoutes);
app.use('/api/wardrobeItems', wardrobeItemsRoutes);
app.use('/api/itemTags', itemTagsRoutes);
app.use('/api/outfits', outfitsRoutes);
app.use('/api/marketPlace',marketPlaceRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
