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
    limits: { fileSize: 500000 }, // 500KB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
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
routerW.post('/wardrobeItems', upload.single('image'), async (req, res) => {
    const { userId, name, category, color, description } = req.body;

    // Check if image is uploaded
    if (!req.file) {
        return res.status(400).json({ msg: "Image is required" });
    }

    const imageUrl = `/uploads/${req.file.filename}`; // Construct image URL

    try {
        const wardrobeItem = await prismaW.wardrobeItem.create({
            data: {
                userId: parseInt(userId), // Ensure userId is an integer
                name,
                category,
                color,
                imageUrl,
                description,
            }
        });
        res.status(201).json(wardrobeItem);
    } catch (error) {
        res.status(500).json({ msg: "Error creating wardrobe item", error: error.message });
    }
});

// Fetch all wardrobe items
routerW.get('/wardrobeItems', async (req, res) => {
    const wardrobeItems = await prismaW.wardrobeItem.findMany();
    res.json(wardrobeItems);
});

// Fetch a specific wardrobe item by id
routerW.get('/wardrobeItems/:id', async (req, res) => {
    const wardrobeItem = await prismaW.wardrobeItem.findUnique({ where: { id: Number(req.params.id) } });
    if (wardrobeItem) {
        res.json(wardrobeItem);
    } else {
        res.status(404).json({ msg: "Wardrobe item not found" });
    }
});

// Update a wardrobe item
routerW.put('/wardrobeItems/:id', upload.single('image'), async (req, res) => {
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
routerW.delete('/wardrobeItems/:id', async (req, res) => {
    try {
        await prismaW.wardrobeItem.delete({ where: { id: Number(req.params.id) } });
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ msg: "Error deleting wardrobe item", error: error.message });
    }
});

export default routerW;