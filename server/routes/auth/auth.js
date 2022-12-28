const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../../models/User")
const SECRET_KEY = process.env.SECRET_KEY

router.post("/register" , async(req, res) => {
   try{
    const {email, name, birthday, career, phoneNumber, password, confirmPassword} = req.body
    const emailExisting = await User.findOne({email: req.body.email})
    if(emailExisting) return res.status(403).json({msg: "That email has already existed"})
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    
    const newUser = await new User({
        email: email,
        name: name,
        birthday: birthday,
        career: career,
        phoneNumber: phoneNumber,
        password: hash
    })
    const userSaving = await newUser.save()
    return res.status(200).json(userSaving)
   }catch(e){
    console.log(e)
   }
})

router.post("/login", async(req, res) => {
    const {email, password} = req.body
    const user = await User.findOne({email: email})
    if(email=="" || password=="") return res.status(403).json({msg: "All fields are requried"})
    if(!user) return res.status(403).json({msg:"Email or password is wrong, please try again"})
    const validPassword = await bcrypt.compare(password, user.password)
    if(user && validPassword){
        const accessToken = jwt.sign({
            id: user.id,
            isAdmin: user.isAdmin},
            SECRET_KEY, 
            {expiresIn: "7d"})
        
        const { password, ...info } = user._doc
        return res.status(200).json({ ...info, accessToken })
    }else{
        return res.status(403).json({msg:"Email or password is wrong, please try again"})
    }
})

module.exports = router