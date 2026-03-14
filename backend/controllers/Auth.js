const User = require("../models/user.model");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config();

exports.Signup=async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        if(!name || !email ||!password){
            return res.status(400).json({
                success:false,
                message:"All fields are required."
            })
        }

        // verify user Exist or not 
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(401).json({
                success:false,
                message:"User Already Exists. Please Logged In!"
            })
        }

        // hash the password
        let salt=10;
        const hashPassword=await bcrypt.hash(password,salt);
        const newUser=await User.create({
            name,
            email,
            password:hashPassword,
        })
        
        newUser.password=undefined;

        return res.status(201).json({
            success:true,
            message:"User Registrated Successfully",
            newUser
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong! Please try again later."
        })
    }
}



exports.Login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email ||!password){
            return res.status(400).json({
                success:false,
                message:"Email and Password must be required."
            })
        }

        // verify user exist or not 
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({
                success:false,
                message:"User not Exist! Please Signup "
            })
        }

        //if user exist verify password
        const verifyPassword = await bcrypt.compare(password, user.password);

        if(verifyPassword){
            // create token 
            const payload={
                id: user._id,
                email: user.email,

            }
            const token=await jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"24h"
            });

            user.password = undefined;
            user.token=token;
            

            const options={
                httpOnly:true,
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
              
            }

            // send data using cookie
            return res.cookie("token",token,options).status(200).json({
                success:true,
                message:"User Logged In Successfully!",
                user,
                token
            })
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            });
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while Logged In! Please try again Later."
        })
    }
}
