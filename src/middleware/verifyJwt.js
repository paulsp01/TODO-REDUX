import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
export const authenticate=async (req,res,next)=>{
    try {
        const token=req.cookies.refreshtoken || req.header('Authorization')?.replace('Bearer',"")
       
        if(!token){
            return res.status(401).json({message:"token not found"})
        }

        const decodedToken =  jwt.verify(token, process.env.REFRESHTOKEN);

    const newUser = await User.findById(decodedToken?.id);

    if (!newUser) {
      return res.statue(409).json({ message: "Unauthorized User" });
    }

    req.user = newUser;
   
    next();
  } 
        
     catch (error) {
        return res.status(500).json({message:"Internal server error",error})
    }

}



