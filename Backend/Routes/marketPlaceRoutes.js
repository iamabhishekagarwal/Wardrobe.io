// ItemTag Routes
import express from "express";
import { PrismaClient } from "@prisma/client";

const routerM = express.Router();
const prismaM = new PrismaClient();

// Middleware to check for userId
const requireUserId = (req, res, next) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "userId is required." });
  }
  next();
};

// Endpoint to sell an item
routerM.post("/sell", requireUserId, async (req, res) => {
  const { userId, wardrobeItemId, price } = req.body;

  try {
    const marketplaceItem = await prismaM.marketplaceItem.create({
      data: {
        userId,
        wardrobeItemId,
        price,
        transactionType: "SELL",
        status: "ACTIVE",
      },
    });
    res.status(201).json(marketplaceItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to create sell listing." });
  }
});

// Endpoint to donate an item
routerM.post("/donate", requireUserId, async (req, res) => {
  const { userId, wardrobeItemId } = req.body;

  try {
    const marketplaceItem = await prismaM.marketplaceItem.create({
      data: {
        userId,
        wardrobeItemId,
        transactionType: "DONATE",
        status: "ACTIVE",
      },
    });
    res.status(201).json(marketplaceItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to create donation listing." });
  }
});

// Endpoint to rent an item
routerM.post("/rent", requireUserId, async (req, res) => {
  const { userId, wardrobeItemId, rentalPrice } = req.body;

  try {
    const marketplaceItem = await prismaM.marketplaceItem.create({
      data: {
        userId,
        wardrobeItemId,
        rentalPrice,
        transactionType: "RENT",
        status: "ACTIVE",
      },
    });
    res.status(201).json(marketplaceItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to create rent listing." });
  }
});

// Endpoint to buy an item
routerM.post("/buy", requireUserId, async (req, res) => {
    const { userId, marketplaceItemId } = req.body;
  
    try {
      // Find the marketplace item
      const marketplaceItem = await prismaM.marketplaceItem.findUnique({
        where: { id: marketplaceItemId },
        include: { wardrobeItem: true }, // Include the related wardrobe item
      });
  
      if (!marketplaceItem) {
        return res.status(404).json({ error: "Item not found." });
      }
  
      // Update the marketplace item status to SOLD
      const updatedMarketplaceItem = await prismaM.marketplaceItem.update({
        where: { id: marketplaceItemId },
        data: { status: "SOLD" },
      });
  
      // Update the WardrobeItem to assign it to the new owner (buyer)
      const updatedWardrobeItem = await prismaM.wardrobeItem.update({
        where: { id: marketplaceItem.wardrobeItemId },
        data: { userId: userId }, // Assign the item to the new owner
      });
  
      res.status(200).json({ updatedMarketplaceItem, updatedWardrobeItem });
    } catch (error) {
      res.status(500).json({ error: "Failed to complete the purchase." });
    }
  });
  

// Endpoint to receive a donation
routerM.post("/donate/receive", requireUserId, async (req, res) => {
    const { userId, marketplaceItemId } = req.body;
  
    try {
      // Find the marketplace item
      const marketplaceItem = await prismaM.marketplaceItem.findUnique({
        where: { id: marketplaceItemId },
        include: { wardrobeItem: true }, // Include the related wardrobe item
      });
  
      if (!marketplaceItem) {
        return res.status(404).json({ error: "Item not found." });
      }
  
      // Update the marketplace item status to DONATED
      const updatedMarketplaceItem = await prismaM.marketplaceItem.update({
        where: { id: marketplaceItemId },
        data: { status: "DONATED" },
      });
  
      // Update the WardrobeItem to assign it to the new owner (receiver of donation)
      const updatedWardrobeItem = await prismaM.wardrobeItem.update({
        where: { id: marketplaceItem.wardrobeItemId },
        data: { userId: userId }, // Assign the item to the new owner (donation receiver)
      });
  
      res.status(200).json({ updatedMarketplaceItem, updatedWardrobeItem });
    } catch (error) {
      res.status(500).json({ error: "Failed to receive the donation." });
    }
  });
  

// Endpoint to take an item on rent
routerM.post("/rent/take", requireUserId, async (req, res) => {
    const { userId, marketplaceItemId } = req.body;
  
    try {
      // Find the marketplace item
      const marketplaceItem = await prismaM.marketplaceItem.findUnique({
        where: { id: marketplaceItemId },
        include: { wardrobeItem: true }, // Include the related wardrobe item
      });
  
      if (!marketplaceItem) {
        return res.status(404).json({ error: "Item not found." });
      }
  
      // Update the marketplace item status to RENTED
      const updatedMarketplaceItem = await prismaM.marketplaceItem.update({
        where: { id: marketplaceItemId },
        data: { status: "RENTED" },
      });
  
      // Optionally, you could append this to the renter's wardrobe, or track rental ownership differently.
      const updatedWardrobeItem = await prismaM.wardrobeItem.update({
        where: { id: marketplaceItem.wardrobeItemId },
        data: { userId: userId }, // Assign the rented item to the user temporarily
      });
  
      res.status(200).json({ updatedMarketplaceItem, updatedWardrobeItem });
    } catch (error) {
      res.status(500).json({ error: "Failed to take the item on rent." });
    }
  });
  

// Endpoint to get all marketplace items by status
routerM.get("/items/status/:status", async (req, res) => {
  const { status } = req.params;

  try {
    const items = await prismaM.marketplaceItem.findMany({
      where: {
        status: status.toUpperCase(), // Ensure status is in uppercase to match enum
      },
    });

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve items by status." });
  }
});

// Endpoint to get all marketplace items by transaction type
routerM.get("/items/type/:type", async (req, res) => {
  const { type } = req.params;

  try {
    const items = await prismaM.marketplaceItem.findMany({
      where: {
        transactionType: type.toUpperCase(), // Ensure type is in uppercase to match enum
      },
    });

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve items by transaction type." });
  }
});

export default routerM;
