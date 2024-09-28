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
    // Update the marketplace item status to SOLD
    const updatedItem = await prismaM.marketplaceItem.update({
      where: { id: marketplaceItemId },
      data: {
        status: "SOLD",
      },
    });

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to complete the purchase." });
  }
});

// Endpoint to receive a donation
routerM.post("/donate/receive", requireUserId, async (req, res) => {
  const { userId, marketplaceItemId } = req.body;

  try {
    // Update the marketplace item status to DONATED
    const updatedItem = await prismaM.marketplaceItem.update({
      where: { id: marketplaceItemId },
      data: {
        status: "DONATED",
      },
    });

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to receive the donation." });
  }
});

// Endpoint to take an item on rent
routerM.post("/rent/take", requireUserId, async (req, res) => {
  const { userId, marketplaceItemId } = req.body;

  try {
    // Update the marketplace item status to RENTED
    const updatedItem = await prismaM.marketplaceItem.update({
      where: { id: marketplaceItemId },
      data: {
        status: "RENTED",
      },
    });

    res.status(200).json(updatedItem);
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
