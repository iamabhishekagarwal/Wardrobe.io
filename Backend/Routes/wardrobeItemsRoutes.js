import express from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
const routerW = express.Router();
const prismaW = new PrismaClient();
const uploadDir = "./uploads";

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Initialize multer
const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5000KB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error("Error: Images Only!"));
    }
  },
});

// Image upload and wardrobe item creation endpoint
routerW.post("/addItems", upload.single("image"), async (req, res) => {
  const { userId, name, category, color, description, occasion, type } = req.body;

  // Check if image is uploaded
  if (!req.file) {
    return res.status(400).json({ msg: "Image is required" });
  }

  const imageUrl = `/uploads/${req.file.filename}`; // Construct image URL from the uploaded file

  try {
    // Ensure userId is an integer
    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedUserId)) {
      return res.status(400).json({ msg: "Invalid userId" });
    }

    // Create the wardrobe item
    const wardrobeItem = await prismaW.wardrobeItem.create({
      data: {
        userId: parsedUserId,
        name,
        category,
        color: color || null, // Make sure optional fields are handled
        imageUrl,
        occasion: occasion || "casual", // Set default value if not provided
        description: description || null, // Ensure description can be nullable
        type: type || "casual",
      },
    });
    
    res.status(201).json(wardrobeItem);
  } catch (error) {
    res.status(500).json({ msg: "Error creating wardrobe item", error: error.message });
  }
});


// Fetch all wardrobe items
routerW.get("/getAllItems", async (req, res) => {
  const wardrobeItems = await prismaW.wardrobeItem.findMany();
  res.json(wardrobeItems);
});
routerW.post("/getItems", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    // If userId is not provided, return an error
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const wardrobeItems = await prismaW.wardrobeItem.findMany({
      where: {
        userId: userId, // Ensure that only items for the given userId are retrieved
      },
      include: { tags: true },
    });

    // Send only items that belong to the provided userId
    res.json(wardrobeItems);
  } catch (error) {
    console.error("Error fetching wardrobe items:", error);
    res.status(500).json({ error: "Failed to fetch wardrobe items" });
  }
});

// Fetch a specific wardrobe item by id
routerW.get("/getItemByID/:id", async (req, res) => {
  const wardrobeItem = await prismaW.wardrobeItem.findUnique({
    where: { id: Number(req.params.id) },
  });
  if (wardrobeItem) {
    res.json(wardrobeItem);
  } else {
    res.status(404).json({ msg: "Wardrobe item not found" });
  }
});

// Update a wardrobe item
routerW.put("/updateItemByID/:id", upload.single("image"), async (req, res) => {
  const { name, category, color, description } = req.body;
  let imageUrl = req.body.imageUrl;

  // If a new image is uploaded, update the imageUrl
  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  }

  try {
    const wardrobeItem = await prismaW.wardrobeItem.update({
      where: { id: Number(req.params.id) },
      data: { name, category, color, imageUrl, description },
    });
    res.json(wardrobeItem);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error updating wardrobe item", error: error.message });
  }
});

// Delete a wardrobe item
routerW.delete("/deleteItemByID/:id", async (req, res) => {
  try {
    // Ensure itemId is a valid number

    await prismaW.wardrobeItem.delete({
      where: { id: Number(req.params.id) }, // Deleting by the primary key 'id', not userId
    });
    res.sendStatus(204); // Successful deletion, no content
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error deleting wardrobe item", error: error.message });
  }
});

routerW.post("/updateSelected", async (req, res) => {
  const { top, bottom, shoes } = req.body; // Expecting top, bottom, shoes as IDs

  try {
    // Increment count for top by ID
    await prismaW.wardrobeItem.update({
      where: { id: top }, // Use the ID of the top item
      data: { count: { increment: 1 } }, // Increment the count by 1
    });

    // Increment count for bottom by ID
    await prismaW.wardrobeItem.update({
      where: { id: bottom }, // Use the ID of the bottom item
      data: { count: { increment: 1 } }, // Increment the count by 1
    });

    // Increment count for shoes by ID
    await prismaW.wardrobeItem.update({
      where: { id: shoes }, // Use the ID of the shoes item
      data: { count: { increment: 1 } }, // Increment the count by 1
    });

    res.status(200).json({ message: "Wardrobe items updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Failed to update wardrobe items",
        details: error.message,
      });
  }
});

routerW.post("/maxCounts", async (req, res) => {
  const { userId } = req.body; // Extract userId from the request body

  try {
    // Get the wardrobe item with the maximum count for 'top' for the specified user
    const maxTop = await prismaW.wardrobeItem.findFirst({
      where: { category: "top", userId: parseInt(userId) }, // Add userId condition
      orderBy: { count: "desc" }, // Order by count in descending order
      take: 1, // Take the top result
    });

    // Get the wardrobe item with the maximum count for 'bottom' for the specified user
    const maxBottom = await prismaW.wardrobeItem.findFirst({
      where: { category: "bottom", userId: parseInt(userId) }, // Add userId condition
      orderBy: { count: "desc" },
      take: 1,
    });

    // Get the wardrobe item with the maximum count for 'shoes' for the specified user
    const maxShoes = await prismaW.wardrobeItem.findFirst({
      where: {
        category: { equals: "shoe", mode: "insensitive" },
        userId: parseInt(userId),
      }, // Add userId condition
      orderBy: { count: "desc" },
      take: 1,
    });

    // Return the items with the maximum count for each category
    res.status(200).json({
      maxTop: maxTop || null, // Return null if no top found
      maxBottom: maxBottom || null, // Return null if no bottom found
      maxShoes: maxShoes || null, // Return null if no shoes found
    });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Failed to fetch maximum counts",
        details: error.message,
      });
  }
});

routerW.post("/minCounts", async (req, res) => {
  try {
    const { userId } = req.body;
    // Get the wardrobe item with the minimum count for 'top'
    const minTop = await prismaW.wardrobeItem.findFirst({
      where: { category: "top", userId: parseInt(userId) },
      orderBy: { count: "asc" }, // Order by count in ascending order
      take: 1, // Take the top result
    });

    // Get the wardrobe item with the minimum count for 'bottom'
    const minBottom = await prismaW.wardrobeItem.findFirst({
      where: { category: "bottom", userId: parseInt(userId) },
      orderBy: { count: "asc" },
      take: 1,
    });

    // Get the wardrobe item with the minimum count for 'shoes'
    const minShoes = await prismaW.wardrobeItem.findFirst({
      where: {
        category: { equals: "shoe", mode: "insensitive" },
        userId: parseInt(userId),
      },
      orderBy: { count: "asc" },
      take: 1,
    });

    // Return the items with the minimum count for each type
    res.status(200).json({
      minTop: minTop || null, // Return null if no top found
      minBottom: minBottom || null, // Return null if no bottom found
      minShoes: minShoes || null, // Return null if no shoes found
    });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Failed to fetch minimum counts",
        details: error.message,
      });
  }
});

export default routerW;
