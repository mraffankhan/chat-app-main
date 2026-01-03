import { User } from "../models/user.model.js";
import generateTokenSetCookie from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password, confirmPassword, gender } =
      req.body;

    if (
      !fullName ||
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      !gender
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Passwords and Confirm password need to be same" });
    }

    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const boyAvatar = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlAvatar = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyAvatar : girlAvatar,
    });

    if (newUser) {
      generateTokenSetCookie(newUser._id, res);
      await newUser.save();
      // res.status(201).json({
      //   _id: newUser._id,
      //   fullName: newUser.fullName,
      //   username: newUser.username,
      //   email: newUser.email,
      //   password: newUser.password,
      //   gender: newUser.gender,
      //   profilePic: newUser.profilePic,
      // });
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "User registration failed" });
    }
  } catch (error) {
    console.log("error in signup controller", error);
    res.status(500).json({ error: "Internal server Error!" });
  }
};

export const login = async (req, res) => {
  const { key, password } = req.body;

  if (!key || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const query = key.includes("@") ? { email: key } : { username: key };
    const user = await User.findOne(query);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    generateTokenSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      message: "User logged in successfully",
    }); // Return user data if needed
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

// https://avatar.iran.liara.run/public/boy?username=aditya
