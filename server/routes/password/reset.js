const express = require("express")
const crypto = require("crypto")
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer")
const User = require("../../models/User")
const router = express.Router()

router.post("/forgot", async(req, res) => {
    const buf = crypto.randomBytes(16)
    const token = buf.toString("hex")
    const user = await User.findOne({email: req.body.email})
    if(req.body.email==="") return res.status(403).json({msg:"Email is required"})
    if(!user) return res.status(403).json({msg:"No account with that email address exist"})
    user.resetPasswordToken = token
    user.resetPasswordExpires = Date.now() + 3600000
    await user.save()

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth:{
            user: "18a12010094@students.hou.edu.vn",
            pass: process.env.EMAIL_PASSWORD
        }
    })

    await transporter.sendMail({
        from:"18a12010094@students.hou.edu.vn",
        to: user.email,
        subject:"Reset your password",
        html: `<h3>You have requested for password reset</h3>
               <p>You are receiving it because you(or someone else) have requested the reset of the password
               for your account. Please click this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</p>`
    })
    return res.status(200).json({msg: "An email has been sent to you, please check your email"})
})

router.get("/reset/:token", async(req, res) => {
    const user = await User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}})
    if(!user) return res.status(403).json({msg:"Invalid"})
    return res.status(200).json({msg:"Valid"})
})

router.put("/reset/:token", async(req, res) => {
    const { newPassword, confirmNew } = req.body
    const user = await User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}})
    if(newPassword==="" || confirmNew==="") return res.status(403).json({msg:"All fields are required"})
    if(!user) return res.status(403).json({msg:"Password reset token is invalid or has expired"})
    if(newPassword !== confirmNew) return res.status(403).json({msg:"Passwords do not match"})
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(newPassword, salt)
    user.password = hash
    user.resetPasswordExpires = undefined
    user.resetPasswordExpires = undefined
    await user.save()
    return res.status(200).json({msg:"Reset password successfully, you can close this window"})
})

module.exports = router