// Outfit Routes
import express from "express";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

const routerO = express.Router();

const prismaO = new PrismaClient();
routerO.post('/outfits', async (req, res) => {
    const { userId, name, description } = req.body;
    const outfit = await prismaO.outfit.create({
      data: { userId, name, description }
    });
    res.json(outfit);
  });
  
  routerO.get('/outfits', async (req, res) => {
    const outfits = await prismaO.outfit.findMany();
    res.json(outfits);
  });
  
  routerO.get('/outfits/:id', async (req, res) => {
    const outfit = await prismaO.outfit.findUnique({ where: { id: Number(req.params.id) } });
    res.json(outfit);
  });
  
  routerO.put('/outfits/:id', async (req, res) => {
    const { name, description } = req.body;
    const outfit = await prismaO.outfit.update({
      where: { id: Number(req.params.id) },
      data: { name, description }
    });
    res.json(outfit);
  });
  
  routerO.delete('/outfits/:id', async (req, res) => {
    await prismaO.outfit.delete({ where: { id: Number(req.params.id) } });
    res.sendStatus(204);
  });
  
  export default routerO;