// User Routes
import express from "express";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const routerU = express.Router();
const prismaU = new PrismaClient();

// Define a Zod schema for input validation
const userSchema = z.object({
    email: z.string().email(),
    name: z.string().optional(),
});

// Function to insert a user into the database
async function insertUser(data) {
    try {
        const res = await prismaU.user.create({
            data,
        });
        return res;
    } catch (error) {
        console.error("Error inserting user:", error);
        throw error;
    }
}

// Function to verify a user by email in the database
async function verifyUser(email) {
    try {
        const res = await prismaU.user.findUnique({
            where: { email },
        });
        return res;
    } catch (error) {
        console.error("Error verifying user:", error);
        throw error;
    }
}

// Signup endpoint
routerU.post("/signup", async (req, res) => {
    const { email, name } = req.body;

    const inputValidation = userSchema.safeParse({ email, name });
    if (!inputValidation.success) {
        return res.status(400).json({ msg: "Inputs are not valid" });
    }

    try {
        const user = await insertUser({ email, name });
        res.status(201).json({ msg: "User created successfully", id: user.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error creating user" });
    }
});

// Signin endpoint
routerU.post("/signin", async (req, res) => {
    const { email } = req.body;

    const inputValidation = userSchema.safeParse({ email });
    if (!inputValidation.success) {
        return res.status(400).json({ msg: "Inputs are not valid" });
    }

    try {
        const user = await verifyUser(email);
        if (user) {
            return res.status(200).json({ msg: "User verified successfully", id: user.id });
        } else {
            return res.status(404).json({ msg: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ msg: "Error verifying user" });
    }
});

// CRUD operations for users

// Create a user
routerU.post('/users', async (req, res) => {
    const { email, name } = req.body;

    const inputValidation = userSchema.safeParse({ email, name });
    if (!inputValidation.success) {
        return res.status(400).json({ msg: "Inputs are not valid" });
    }

    try {
        const user = await prismaU.user.create({
            data: { email, name }
        });
        res.status(201).json(user);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ msg: "Error creating user" });
    }
});

// Get all users
routerU.get('/users', async (req, res) => {
    try {
        const users = await prismaU.user.findMany();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ msg: "Error fetching users" });
    }
});

// Get a user by ID
routerU.get('/users/:id', async (req, res) => {
    try {
        const user = await prismaU.user.findUnique({ where: { id: Number(req.params.id) } });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ msg: "User not found" });
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ msg: "Error fetching user" });
    }
});

// Update a user by ID
routerU.put('/users/:id', async (req, res) => {
    const { email, name } = req.body;

    const inputValidation = userSchema.safeParse({ email, name });
    if (!inputValidation.success) {
        return res.status(400).json({ msg: "Inputs are not valid" });
    }

    try {
        const user = await prismaU.user.update({
            where: { id: Number(req.params.id) },
            data: { email, name }
        });
        res.json(user);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ msg: "Error updating user" });
    }
});

// Delete a user by ID
routerU.delete('/users/:id', async (req, res) => {
    try {
        await prismaU.user.delete({ where: { id: Number(req.params.id) } });
        res.sendStatus(204);
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ msg: "Error deleting user" });
    }
});

// Export the router
export default routerU;