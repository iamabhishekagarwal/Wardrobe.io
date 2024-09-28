// Outfit Routes
import express from "express";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

const routerO = express.Router();

const prismaO = new PrismaClient();

async function suggestOutfit(clothes) {
    let outfits = [];
    // Filter clothes by category and occasion
    const tops = clothes.filter(item => item.category === 'top');
    const bottoms = clothes.filter(item => item.category === 'bottom');
    const shoes = clothes.filter(item => item.category === 'shoe');
    // Generate outfits based on matching occasion
    tops.forEach((top) => {
      bottoms.forEach((bottom) => {
        shoes.forEach((shoe) => {
          // Check if the occasion matches
          if (top.occasion === bottom.occasion && bottom.occasion === shoe.occasion) {
            outfits.push({
              top: top.id,
              bottom: bottom.id,
              shoes: shoe.id,
              occasion: top.occasion // Add occasion to the outfit
            });
          }
        });
      });
    });
  
    return outfits;
  }
  

routerO.post("/generateOutfits", async (req, res) => {
  const { userId } = req.body;

  try {
    const wardRobeItems = await prismaO.wardrobeItem.findMany({
      where: { userId: userId },
    });
    let outfits = await suggestOutfit(wardRobeItems);
    res.status(200).json({ outfits: outfits });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch wardrobe items" });
  }
});

routerO.post("/randomOutfits",async(req,res)=>{
  const { userId } = req.body;
  try {
    const wardRobeItems = await prismaO.wardrobeItem.findMany({
      where: { userId: userId },
    });
    let outfits = await suggestOutfit(wardRobeItems);
    if (outfits.length > 0) {
      const randomIndex = Math.floor(Math.random() * outfits.length);
          const randomOutfit = outfits[randomIndex];
    res.status(200).json({ outfit: randomOutfit }); 
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to Make RandomOutfit" });
  }
})

routerO.post("/outfits", async (req, res) => {
  const { userId, name, description } = req.body;
  const outfit = await prismaO.outfit.create({
    data: { userId, name, description },
  });
  res.json(outfit);
});

routerO.get("/outfits", async (req, res) => {
  const outfits = await prismaO.outfit.findMany();
  res.json(outfits);
});

routerO.get("/outfits/:id", async (req, res) => {
  const outfit = await prismaO.outfit.findUnique({
    where: { id: Number(req.params.id) },
  });
  res.json(outfit);
});

routerO.put("/outfits/:id", async (req, res) => {
  const { name, description } = req.body;
  const outfit = await prismaO.outfit.update({
    where: { id: Number(req.params.id) },
    data: { name, description },
  });
  res.json(outfit);
});

routerO.delete("/outfits/:id", async (req, res) => {
  await prismaO.outfit.delete({ where: { id: Number(req.params.id) } });
  res.sendStatus(204);
});

export default routerO;
