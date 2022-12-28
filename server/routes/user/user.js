const express = require("express")
const router = express.Router()
const User = require("../../models/User")
const verifyMiddleware = require("../../verify")

router.get("/all", async(req, res) => {
    const users = await User.find()
    return res.status(200).json(users)
})

router.put("/:id", verifyMiddleware, async(req, res) => {
    if(req.user.id === req.params.id || req.user.isAdmin){
        const updateUser = await User.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
        return res.status(200).json(updateUser)
    }else{
        return res.status(403).json({msg: "You can update only your account"})
    }
})

router.put("/:id", verifyMiddleware, async(req, res) => {
    if(req.user.id === req.params.id || req.user.isAdmin){
        await User.findByIdAndDelete(req.params.id)
        return res.status(200).json("Delete successfully")
    }else{
        res.status(403).json({msg:"You can delete only your account"})
    }
})

router.get("/friend/:id", async(req, res) => {
    const user = await User.findById(req.params.id)
    const friends = await Promise.all(
        user.following.map(friendId => {
            return User.findById(friendId)
        })
    )
    return res.status(200).json(friends)
})

router.get("/", async(req, res) => {
    const userId = req.query.userId
    const userName = req.query.userName
    const user = userId
        ? await User.findById(userId)
        : await User.findOne({name: userName})
    const {email, password, date, isAdmin, ...other} = user._doc
    res.status(200).json(other)
}) 

module.exports = router