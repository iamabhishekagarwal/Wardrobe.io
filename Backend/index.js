import express from 'express';
import {z} from "zod"
import { PrismaClient  } from '@prisma/client/extension';
const app = express();
const port = 5172;


const prisma = new PrismaClient();
const userSchema = z.object({
    username: z.string(),
    email: z.string().email(),
  });

app.use(express.json());

async function insertUser(username, email){
    try {
      const res = await prisma.User.create({
        data: {
          username,
          email,
        },
      });
      return res;
    } catch (error) {
      console.error("Error inserting user:", error);
      throw error;
    }
  }

  async function verifyUser(
    username,
    email)
    {
    try {
      const res = await prisma.user.findFirst({
        where: {
          username,
          email,
        },
      });
      return res;
    } catch (error) {
      console.error("Error verifying user:", error);
      throw error;
    }
  }

app.post("/api/signup", async (req, res) => {
    const { username, email } = req.body;
  
    const inputValidation = userSchema.safeParse({
      username,
      email,
    });
    if (!inputValidation.success) {
      return res.status(400).json({ msg: "Inputs are not valid" });
    }
  
    try {
      const user = await insertUser(username, email);
      res.status(201).json({ msg: "User created successfully",id:user.id });
    } catch (error) {
      console.log(error)
      res.status(500).json({ msg: "Error creating user" });
    }
  })

  app.post("/api/signin", async (req, res) => {
    const { username, email } = req.body;
    const inputValidation = userSchema.safeParse({
      username,
      email,
    });
    if (!inputValidation.success) {
      return res.status(400).json({ msg: "Inputs are not valid" });
    }
    try {
      const user = await verifyUser(username, email);
      if (user) {
        return res.status(200).json({ msg: "User verified successfully" ,id:user.id});
      } else {
        return res.status(200).json({ msg: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ msg: "Error verifying user" });
    }
  });

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

