// WardrobeItem Routes
import express from "express";
import { z } from "zod";
import { PrismaClient} from "@prisma/client";
import dotenv from "dotenv";

const routerW = express.Router();

const prismaW = new PrismaClient();
dotenv.config();
routerW.post('/wardrobeItems', async (req, res) => {
    const { userId, name, category, color, imageUrl, description } = req.body;
    const wardrobeItem = await prismaW.wardrobeItem.create({
      data: { userId, name, category, color, imageUrl, description }
    });
    res.json(wardrobeItem);
  });
  
  routerW.get('/wardrobeItems', async (req, res) => {
    const wardrobeItems = await prismaW.wardrobeItem.findMany();
    res.json(wardrobeItems);
  });
  
  routerW.get('/wardrobeItems/:id', async (req, res) => {
    const wardrobeItem = await prismaW.wardrobeItem.findUnique({ where: { id: Number(req.params.id) } });
    res.json(wardrobeItem);
  });
  
  routerW.put('/wardrobeItems/:id', async (req, res) => {
    const { name, category, color, imageUrl, description } = req.body;
    const wardrobeItem = await prismaW.wardrobeItem.update({
      where: { id: Number(req.params.id) },
      data: { name, category, color, imageUrl, description }
    });
    res.json(wardrobeItem);
  });
  
  routerW.delete('/wardrobeItems/:id', async (req, res) => {
    await prismaW.wardrobeItem.delete({ where: { id: Number(req.params.id) } });
    res.sendStatus(204);
  });
  export default routerW;