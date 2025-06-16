import { Request, Response } from "express";
import User from "../models/userModels";
import { generateToken } from "../utlis/authUtils";
import bcrypt from "bcrypt";
import { CustomJwtPayload } from "../types/authTypes";

// Register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    console.log(req.body)

    if (!username || !email  || !password) {
      res.status(400).json({ error: "Username, email, and password are required." });
      return;
    }


    if (password.length < 8 || password.length > 20) {
      res.status(400).json({ error: "Password must be between 8 and 20 characters." });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json("email is already registered.");
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      passwordHash,
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      data: { id: newUser._id, username, email, },
    });
  } catch (err) {
    res.status(500).json({
      message: "Registration failed",
      error: (err as Error).message,
    });
  }
};

// Login a user and issue a JWT
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required." });
      return;
    }

    const user = await User.findOne({ email }) as (typeof User)["prototype"];
    if (!user) {
      res.status(401).json({ message: "Invalid email ." });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid  password." });
      return;
    }

    const payload: CustomJwtPayload = {
      userId: user._id.toString(),
      username: user.username,
      email:user.email
    
    };

    const token = generateToken(payload);

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging in." });
  }
}

// Get Profile
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userObj = typeof req.user.toObject === "function" ? req.user.toObject() : req.user;
    const { passwordHash, ...safeUser } = userObj;

    res.status(200).json({
      data: safeUser,
      message: `Welcome back, ${safeUser.username}`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user profile",
      error: (error as Error).message,
    });
  }
};



// Update user profile
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" })
      return
    }

    const { username, bio, password } = req.body

    const updates: Partial<{
      username: string
      bio: string
      passwordHash: string
    }> = {}

    if (username) updates.username = username
    if (bio) updates.bio = bio
    if (password) {
      if (password.length < 8 || password.length > 20) {
        res.status(400).json({ error: "Password must be between 8 and 20 characters." })
        return
      }
      updates.passwordHash = await bcrypt.hash(password, 10)
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select("-passwordHash")

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" })
      return
    }

    res.status(200).json({
      message: "Profile updated successfully",
      data: updatedUser,
    })
  } catch (error) {
    res.status(500).json({
      message: "Error updating profile",
      error: (error as Error).message,
    })
  }
}

// Delete user account
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" })
      return
    }

    const deletedUser = await User.findByIdAndDelete(req.user._id)

    if (!deletedUser) {
      res.status(404).json({ message: "User not found" })
      return
    }

    res.status(200).json({ message: "User deleted successfully" })
  } catch (error) {
    res.status(500).json({
      message: "Error deleting user",
      error: (error as Error).message,
    })
  }
}