const express = require("express")
const router = express.Router()
const Post = require("../../models/Post")
const User = require("../../models/User")
const verifyMiddleware = require("../../verify")

router.put("/:id", verifyMiddleware, async(req, res) => {
    const article = await Post.findById(req.params.id)
    if(!article.hearts.includes(req.user.id)){
        await article.updateOne({$push: {hearts: req.user.id}})
        return res.status(200).json({msg: "Love successfully"})
    }else{
        await article.updateOne({$pull: {hearts: req.user.id}})
        return res.status(200).json({msg: "Cancel love successfully"})
    }
})

module.exports = router