import express from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
const routerW = express.Router();
const prismaW = new PrismaClient();
const uploadDir = './uploads';

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

// Initialize multer
const upload = multer({
    storage,
    limits: { fileSize: 5000000 }, // 5000KB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            cb(null, true);
        } else {
            cb(new Error("Error: Images Only!"));
        }
    },
});

// Image upload and wardrobe item creation endpoint
routerW.post('/addItems', upload.single('image'), async (req, res) => {
    const { userId, name, category, color, description, occasion,type } = req.body;

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

        const wardrobeItem = await prismaW.wardrobeItem.create({
            data: {
                userId: parsedUserId,
                name,
                category,
                color: color || null, // Make sure optional fields are handled
                imageUrl,
                occasion: occasion || 'casual', // Set default value if not provided
                description: description || null, // Ensure description can be nullable
                type: type || 'casual',
            }
        });
        res.status(201).json(wardrobeItem);
    } catch (error) {
        res.status(500).json({ msg: "Error creating wardrobe item", error: error.message });
    }
});


// Fetch all wardrobe items
routerW.get('/getAllItems', async (req, res) => {
    const {userId}=req.body;
    const wardrobeItems = await prismaW.wardrobeItem.findMany({where:{userId:userId},include: { tags: true }});
    res.json(wardrobeItems);
});

// Fetch a specific wardrobe item by id
routerW.get('/getItemByID/:id', async (req, res) => {
    const wardrobeItem = await prismaW.wardrobeItem.findUnique({ where: { id: Number(req.params.id) } });
    if (wardrobeItem) {
        res.json(wardrobeItem);
    } else {
        res.status(404).json({ msg: "Wardrobe item not found" });
    }
});

// Update a wardrobe item
routerW.put('/updateItemByID/:id', upload.single('image'), async (req, res) => {
    const { name, category, color, description } = req.body;
    let imageUrl = req.body.imageUrl;

    // If a new image is uploaded, update the imageUrl
    if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
    }

    try {
        const wardrobeItem = await prismaW.wardrobeItem.update({
            where: { id: Number(req.params.id) },
            data: { name, category, color, imageUrl, description }
        });
        res.json(wardrobeItem);
    } catch (error) {
        res.status(500).json({ msg: "Error updating wardrobe item", error: error.message });
    }
});

// Delete a wardrobe item
routerW.delete('/deleteItemByID/:id', async (req, res) => {
    try {

        // Ensure itemId is a valid number
    

        await prismaW.wardrobeItem.delete({ 
            where: { id: Number(req.params.id) }   // Deleting by the primary key 'id', not userId
        });
        res.sendStatus(204); // Successful deletion, no content
    } catch (error) {
        res.status(500).json({ msg: "Error deleting wardrobe item", error: error.message });
    }
});

routerW.post('/wardrobeItems/updateSelected', async (req, res) => {
  const { top, bottom, shoes } = req.body;  // Expecting top, bottom, shoes as IDs
  
  try {
    // Increment count for top
    await prisma.wardrobeItem.update({
      where: { id: top },
      data: { count: { increment: 1 } },  // Increment the count by 1
    });

    // Increment count for bottom
    await prisma.wardrobeItem.update({
      where: { id: bottom },
      data: { count: { increment: 1 } },  // Increment the count by 1
    });

    // Increment count for shoes
    await prisma.wardrobeItem.update({
      where: { id: shoes },
      data: { count: { increment: 1 } },  // Increment the count by 1
    });

    res.status(200).json({ message: "Wardrobe items updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update wardrobe items" });
  }
});

export default routerW;
