// ItemTag Routes
import express from "express";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

const routerI = express.Router();

const prismaI = new PrismaClient();
routerI.post("/itemTags", async (req, res) => {
  const { wardrobeItemId, tag } = req.body;
  const itemTag = await prismaI.itemTag.create({
    data: { wardrobeItemId, tag },
  });
  res.json(itemTag);
});

routerI.get("/itemTags", async (req, res) => {
  const itemTags = await prismaI.itemTag.findMany();
  res.json(itemTags);
});

routerI.get("/itemTags/:id", async (req, res) => {
  const itemTag = await prismaI.itemTag.findUnique({
    where: { id: Number(req.params.id) },
  });
  res.json(itemTag);
});

routerI.put("/itemTags/:id", async (req, res) => {
  const { tag } = req.body;
  const itemTag = await prismaI.itemTag.update({
    where: { id: Number(req.params.id) },
    data: { tag },
  });
  res.json(itemTag);
});

routerI.delete("/itemTags/:id", async (req, res) => {
  await prismaI.itemTag.delete({ where: { id: Number(req.params.id) } });
  res.sendStatus(204);
});
export default routerI;