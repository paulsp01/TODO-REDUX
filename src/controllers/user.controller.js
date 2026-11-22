
import bcrypt from "bcryptjs";
import {User} from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrtpt from "bcryptjs"

async function generateToken(userId){
   try {
    const user = await User.findById(userId);

    const accesstoken = await user.generateAccessToken();
    const refreshtoken = await user.generateRefreshToken();
   
    user.refreshToken = refreshtoken;
    await user.save({ validateBeforeSave: false });
    return { accesstoken, refreshtoken };
  } catch (error) {
    throw new Error(
      "Something went wrong while generating accessToken and refreshToken",
      error,
    );
  }
}

export const registerUser = asyncHandler(async (req, res) => {
  try {
    const {name, username, email, password} = req.body;
    if (!name || !username || !email || !password) {
      return res.status(400).json({message: "All field required"});
    }
   

    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res.status(400).json({message: "User already exist"});
    }
    const hashedPassword = await bcrtpt.hash(password, 10);
    const newUser = await User.create({name, username, email, password: hashedPassword});
    
    return res.status(201).json({message: "user created successfully", user: newUser});
  } catch (error) {
    return res.status(500).json({message: "Internal server error", error:error.message});
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  try {
    const {email, password} = req.body;
  
    if (!email || !password) {
      return res.status(400).json({message: "All field required"});
    }

    const user = await User.findOne({email});
 
    if (!user) {
      return res.status(400).json({message: "You are not authorized"});
    }

    const isPasswordCorrect = await bcrypt.compare(password,user.password);
    console.log(isPasswordCorrect);
    if (!isPasswordCorrect) {
      return res.status(400).json({message: "email or password are invalid"});
    }

    const {refreshtoken, accesstoken} = await generateToken(user._id);
    console.log(refreshtoken, accesstoken);
    const options = {httpOnly: true, secure: true};

    return res
      .status(201)
      .cookie("accesstoken", accesstoken, options)
      .cookie("refreshtoken", refreshtoken, options)
      .json({message: "you are logged in", user});
  } catch (error) {
    return res.status(500).json({message: "Internal server error", error});
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {$set: {refreshtoken: undefined}},
      {new: true},
    );

    const options = {httpOnly: true, secure: true};
    return res
      .status(200)
      .clearCookie("refreshtoken", options)
      .json({message: "User Logged Out Successfully"});
  } catch (error) {
    return res.status(500).json({message: "Internal server error", error});
  }
});

export const getAllUser = asyncHandler(async (req, res) => {
  try {
    const allUser = await User.find();
    return res.status(200).json({message: "All User", allUser});
  } catch (error) {
    return res.status(500).json({message: "Internal server error", error});
  }
});

export const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({message: "invalid userid"});
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({message: "user not found"});
    }

    return res.status(200).json({message: "user fetched successfully", user});
  } catch (error) {
    return res.status(500).json({message: "Internal server error", error});
  }
});