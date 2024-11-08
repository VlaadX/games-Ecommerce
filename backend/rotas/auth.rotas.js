import express from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const generateTokens = (userId) => {
    const acessToken = jwt.sign({userId}, process.env.JWT_ACCESS_SECRET, {expiresIn: "30m"});
    const refreshToken = jwt.sign({userId}, process.env.JWT_REFRESH_SECRET, {expiresIn: "7d"});
}

const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set('refresh_Token:${user_ID}', refreshToken, 'EX', 7 * 24 * 60 * 60);
}


router.post("/signup", async (req, res) => {

const { email, password, name } = req.body

try {
    const userExists = await User.findOne({email})

    if(userExists) {
        return res.status(400).json({message: "Email ja existe"})
    }
    const user = await User.create({name, email, password});
    const {acessToken, refreshToken} = generateTokens(user._id)
    res.status(201).json(user)
} catch (error) {
    res.status(500).json({message: error.message})
}

})

router.post("/login", (req, res) => {



})

router.post("/logout", (req, res) => {


    
})


export default router