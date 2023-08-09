import User from "../mongodb/models/user.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).limit(req.query._end);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, avatar, role } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction()

    const avatarUrl = await cloudinary.uploader.upload(avatar)

    // Check if the user already exists in the database
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "User with same email address already exists" });
    }


    // Hash the password before storing it in the database
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      avatar: avatarUrl.url,
    });

    await session.commitTransaction();

    res.status(201).json({ message: "User Created Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, password, avatar} = req.body;

    const userToUpdate = User.findById(id);
    if(!userToUpdate) throw new Error ("User not Found");

    const avatarUrl = await cloudinary.uploader.upload(avatar);

    if (role === "admin") {
      await User.findByIdAndUpdate(
        {_id: id},
        {
          name,
          email,
          password,
          role,
          avatar: avatarUrl.url || avatar
        }
      )
    } else {
      await User.findByIdAndUpdate(
        {_id: id},
        {
          name,
          email,
          password,
          avatar: avatarUrl.url || avatar
        }
      )
    }

    res.status(200).json({ message: "Port updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error)
}
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const userToDelete = await User.findById(id)

    if(!userToDelete) throw new Error ("User not found")

    const session = await mongoose.startSession();
    session.startTransaction();

    await User.deleteOne({ _id: id }, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "User Deleted Successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

const getUserInfoByID = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ email });
    // console.log(user)

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordCorrect = await bcrypt.compare(password, user.password);


    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { email: user.email, id: user._id },
      "your_secret_key",
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, _id: user._id, name: user.name, email: user.email, avatar: user.avatar, role: user.role});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllUsers, createUser, getUserInfoByID, login, editUser, deleteUser };