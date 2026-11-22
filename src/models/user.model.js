import mongoose from "mongoose"
import jwt from "jsonwebtoken"

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true

    },
    refreshToken:{
        type:String
    }
})

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.ACCESSTOKEN,
    {
      expiresIn: process.env.ACCESSTOKEN_EXPIRE,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.REFRESHTOKEN,
    {
      expiresIn: process.env.REFRESHTOKEN_EXPIRE,
    }
  );
};


const User=mongoose.model("users",userSchema)
export {User}