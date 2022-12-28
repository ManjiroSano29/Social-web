const express = require("express")
const router = express.Router()
const User = require("../../models/User")
const verifyMiddleware = require("../../verify")

router.put("/follow/:id", verifyMiddleware, async(req, res) => {
    const user = req.user 
    const currentUser = await User.findById(user.id)
    if(user.id !== req.params.id){
        const wantToFollowThisUser = await User.findById(req.params.id)
        if(!wantToFollowThisUser.followers.includes(user.id)){
            await wantToFollowThisUser.updateOne({$push: {followers: user.id}})
            await currentUser.updateOne({$push: {following: wantToFollowThisUser.id}})
            return res.status(200).json({msg: "Follow this user successfully"})
        }else{
            return res.status(403).json({msg: "You have already followed this user"})
        }
    }else{
        return res.status(403).json({msg: "You can't follow yourself"})
    }
})

router.put("/unfollow/:id", verifyMiddleware, async(req, res) => {
    const user = req.user
    const currentUser = await User.findById(user.id)
    if(user.id !== req.params.id){
        const wantToUnFollowThisUser = await User.findById(req.params.id)
        if(wantToUnFollowThisUser.followers.includes(user.id)){
            await wantToUnFollowThisUser.updateOne({$pull: {followers: user.id}})
            await currentUser.updateOne({$pull: {following: wantToUnFollowThisUser.id}})
            return res.status(200).json({msg: "Unfollow this user successfully"})
        }else{
            return res.status(403).json({msg: "You have already unfollowed this use"})
        }
    }else{
        return res.status(403).json({msg: "You can't unfollow yourself"})
    }
})

module.exports = router