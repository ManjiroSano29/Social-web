const express = require("express")
const router = express.Router()
const User = require("../../models/User")
const verifyMiddleware = require("../../verify")

router.put("/:id", verifyMiddleware, async(req, res) => {
    if(req.user.id === req.params.id || req.user.isAdmin){
        const updateProfilePicture = await User.findByIdAndUpdate(
            req.params.id, 
            {profilePicture: req.body.profilePicture}, 
            {new: true})
        return res.status(200).json(updateProfilePicture)
    }else{
        return res.status(403).json({msg: "You can't update profile picture in another account"})
    }
})

router.put("/delete/:id", verifyMiddleware, async(req, res) => {
    if(req.user.id === req.params.id || req.user.isAdmin){
        await User.findByIdAndUpdate(
            req.params.id,
            {$unset: {profilePicture: ""}},
            {new: true}
        )
        return res.status(200).json({msg: "Delete profile picture successfully"})
    }else{
        return res.status(403).json("You can't update profile picture in another account ")
    }
})

module.exports = router