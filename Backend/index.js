import express from 'express';
import {z} from "zod"
import { PrismaClient  } from '@prisma/client/extension';
import cors from 'cors';
import path from 'path';

const app = express();
const port = 5172;

import userRoutes from './Routes/userRoutes.js';
import wardrobeItemsRoutes from './Routes/wardrobeItemsRoutes.js';
import itemTagsRoutes from './Routes/itemTagsRoutes.js';
import outfitsRoutes from './Routes/outfitsRoutes.js';


app.use(cors());

app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/wardrobeItems', wardrobeItemsRoutes);
app.use('/api/itemTags', itemTagsRoutes);
app.use('/api/outfits', outfitsRoutes);



app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

