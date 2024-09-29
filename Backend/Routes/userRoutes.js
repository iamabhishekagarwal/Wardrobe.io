// User Routes
import express from "express";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import multer from 'multer';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import path from 'path';
import { fileURLToPath } from 'url';
import e from "express";


dotenv.config();
const routerU = express.Router();
const prismaU = new PrismaClient();


const colorDistance = (rgb1, rgb2) => {
    return Math.sqrt(
      Math.pow(rgb1.red - rgb2.red, 2) +
      Math.pow(rgb1.green - rgb2.green, 2) +
      Math.pow(rgb1.blue - rgb2.blue, 2)
    );
  };
  
  // Expanded color map with more accurate colors and shades
  const colorMap = [
    { name: 'black', rgb: { red: 0, green: 0, blue: 0 } },
    { name: 'white', rgb: { red: 255, green: 255, blue: 255 } },
    { name: 'gray', rgb: { red: 128, green: 128, blue: 128 } },
    { name: 'light gray', rgb: { red: 211, green: 211, blue: 211 } },
    { name: 'dark gray', rgb: { red: 64, green: 64, blue: 64 } },
    { name: 'red', rgb: { red: 255, green: 0, blue: 0 } },
    { name: 'dark red', rgb: { red: 139, green: 0, blue: 0 } },
    { name: 'light red', rgb: { red: 255, green: 102, blue: 102 } },
    { name: 'blue', rgb: { red: 0, green: 0, blue: 255 } },
    { name: 'dark blue', rgb: { red: 0, green: 0, blue: 139 } },
    { name: 'light blue', rgb: { red: 173, green: 216, blue: 230 } },
    { name: 'green', rgb: { red: 0, green: 255, blue: 0 } },
    { name: 'dark green', rgb: { red: 0, green: 100, blue: 0 } },
    { name: 'light green', rgb: { red: 144, green: 238, blue: 144 } },
    { name: 'yellow', rgb: { red: 255, green: 255, blue: 0 } },
    { name: 'dark yellow', rgb: { red: 204, green: 204, blue: 0 } },
    { name: 'light yellow', rgb: { red: 255, green: 255, blue: 153 } },
    { name: 'purple', rgb: { red: 128, green: 0, blue: 128 } },
    { name: 'light purple', rgb: { red: 216, green: 191, blue: 216 } },
    { name: 'pink', rgb: { red: 255, green: 192, blue: 203 } },
    { name: 'dark pink', rgb: { red: 231, green: 84, blue: 128 } },
    { name: 'cyan', rgb: { red: 0, green: 255, blue: 255 } },
    { name: 'magenta', rgb: { red: 255, green: 0, blue: 255 } },
  ];
  
  // Mapping similar shades to their base color
  const baseColorMap = {
    'dark red': 'red',
    'light red': 'red',
    'dark pink': 'pink',
    'light pink': 'pink',
    'dark blue': 'blue',
    'light blue': 'blue',
    'dark green': 'green',
    'light green': 'green',
    'dark yellow': 'yellow',
    'light yellow': 'yellow',
    'dark gray': 'gray',
    'light gray': 'gray',
    'dark purple': 'purple',
    'light purple': 'purple',
  };
  
  // Function to find the closest color name from the color map
  const rgbToColorName = (rgb) => {
    let closestColor = null;
    let minDistance = Infinity;
  
    for (let color of colorMap) {
      const distance = colorDistance(rgb, color.rgb);
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = color.name;
      }
    }
  
    // Map the closest color to its base color (e.g., 'dark red' → 'red')
    return baseColorMap[closestColor] || closestColor || 'unknown';
  };

const upload = multer({ dest: 'uploads/' });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new ImageAnnotatorClient({
  apiKey: process.env.GOOGLE_API_KEY, // Replace with your actual API key
});
const prisma = new PrismaClient();
const userSchema = z.object({
    email: z.string().email(),
    name: z.string(),
  });
  routerU.post('/item/upload', upload.single('image'), async (req, res) => {
    try {
      const filePath = req.file.path;
      
      // Perform image label detection
      const [result] = await client.labelDetection(filePath);
      const labels = result.labelAnnotations.map(label => label.description);
  
      // Perform image color detection
      const [colorResult] = await client.imageProperties(filePath);
      const colors = colorResult.imagePropertiesAnnotation.dominantColors.colors.map(
        color => color.color
      );
  
      // Combine extracted information (e.g., labels, colors)
      res.json({
        labels,
        dominantColors: colors,
      });
    } catch (error) {
      console.error('Error processing image:', error);
      res.status(500).send('Error processing image');
    }
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
async function verifyUser(
    email
  ) {
    try {
      const res = await prismaU.user.findFirst({
        where: {
          email,
        },
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
    try {
        const user = await insertUser({ email, name });
        res.status(201).json({ msg: "User created successfully", id: user.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error creating user" });
    }
});

// routerU.post("/signin", async (req, res) => {
//     const { name, email } = req.body;
//     const inputValidation = userSchema.safeParse({
//       name,
//       email,
//     });
//     if (!inputValidation.success) {
//       return res.status(400).json({ msg: "Inputs are not valid" });
//     }
//     try {
//       const user = await verifyUser(name, email);
//       if (user) {
//         return res.status(200).json({ msg: "User verified successfully" ,id:user.id});
//       } else {
//         return res.status(200).json({ msg: "User not found" });
//       }
//     } catch (error) {
//       res.status(500).json({ msg: "Error verifying user" ,error});
//     }
//   });
  

// Signin endpoint
routerU.post("/signin", async (req, res) => {
    const { email } = req.body;

    // const inputValidation = userSchema.safeParse({ email });
    // if (!inputValidation.success) {
    //     return res.status(400).json({ msg: "Inputs are not valid" });
    // }

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


routerU.post('/compare-images', async(req, res) => {
    const {userId,visionResponse} = req.body
   
    const databaseItems = await prismaU.wardrobeItem.findMany({
        where: { userId: userId },  
      });
    // Extract the first dominant color from the Google Cloud Vision response
    const dominantColor = visionResponse.dominantColors[0];
    const detectedColorName = rgbToColorName(dominantColor);
  
    // Extract the type from the labels
    const detectedType = visionResponse.labels.find((label) => {
        let labelLower = label.toLowerCase();

        // If the label contains 'shirt' in any form, map it to 'shirt'
        if (labelLower.includes('shirt')) {
            console.log('Detected Shirt Label:', labelLower);  // Debugging log
            return 'shirt'; // Map any label containing 'shirt' to 'shirt'
        } else if (['t-shirt', 'jeans', 'shorts', 'sneakers', 'hiking shoe', 'walking shoe', 'sportswear', 'denim'].includes(labelLower)) {
            return labelLower; // If the label exactly matches one of these, return it
        }
        return null;
    });
  
    // Filter database items that match the detected color and type
    console.log(detectedColorName)
    console.log(detectedType)
    const matchingItems = databaseItems.filter((item) => {
      const isColorMatch = item.color.toLowerCase() === detectedColorName.toLowerCase();
      const isTypeMatch = item.type.toLowerCase() === detectedType?.toLowerCase();
      return isColorMatch && isTypeMatch;
    });
  
    // Return the matching items to the frontend
    res.json(matchingItems);
  });


// Export the router
export default routerU;