import User from "../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const Auth = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email required",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: name || email.split('@')[0],
        email,   
        avatar: avatar || null,
        credits: 100,
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "9d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 9 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      credits: user.credits,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

export const Logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

export const CurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        user: null
      });
    }
    return res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      credits: req.user.credits,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Current User Error"
    });
  }
};

export const GetUserCredits = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('credits');
    return res.status(200).json({
      success: true,
      credits: user.credits || 0
    });
  } catch (error) {
    console.error("Error fetching credits:", error);
    return res.status(500).json({
      message: "Error fetching credits"
    });
  }
};