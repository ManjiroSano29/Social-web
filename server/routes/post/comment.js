const express = require("express")
const router = express.Router()
const Post = require("../../models/Post")
const User = require("../../models/User")
const verifyMiddleware = require("../../verify")

router.put("/:id", verifyMiddleware, async(req, res) => {
    const user = await User.findById(req.user.id)
    const comments = {
        comment: req.body.comment,
        postedBy: {
            name: user.name,
            profilePicture: user.profilePicture
        }
    }
    const updateArticle = await Post.findByIdAndUpdate(req.params.id, {$push: {comments: comments}}, {new: true})
    return res.status(200).json(updateArticle.comments)
})

router.get("/personal/:id", verifyMiddleware, async(req, res) => {
    const user = await User.findById(req.user.id)
    const post = await Post.findById(req.params.id)
    const userComment = await Promise.all(
        post.comments.filter(record => {
            if(record.postedBy.name === user.name) return record
        })
    )
    return res.status(200).json(userComment)
})

router.get("/:id", async(req, res) => {
    const post = await Post.findById(req.params.id)
    const userComments = await Promise.all(
        post.comments.map(record => {
            return record
        })
    )
    return res.status(200).json(userComments)
})

module.exports = router