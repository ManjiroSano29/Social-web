const express = require("express")
const router = express.Router()
const Post = require("../../models/Post")
const User = require("../../models/User")
const verifyMiddleware = require("../../verify")

router.post("/", async(req, res) => {
    const newArticle = new Post({
        user: req.body.user,
        status: req.body.status,
        image: req.body.image
    })
    const article = await newArticle.save()
    return res.status(200).json(article)
})

router.get("/:id", async(req, res) => {
    const article = await Post.findById(req.params.id)
    return res.status(200).json(article)
})

router.put("/:id", verifyMiddleware, async(req, res) => {
    const article = await Post.findById(req.params.id)
    if(req.user.id === article.user || req.user.isAdmin){
        const updateArticle = await Post.findByIdAndUpdate(req.params.id, {status: req.body.status}, {new: true})
        return res.status(200).json(updateArticle)
    }else{
        return res.status(403).json({msg: "You can't update other's article"})
    }
})

router.delete("/:id", verifyMiddleware, async(req, res) => {
    const article = await Post.findById(req.params.id)
    if(req.user.id === article.user || req.user.isAdmin){
        await Post.findByIdAndDelete(req.params.id)
        return res.status(200).json({msg: "Delele this article successfully"})
    }else{
        return res.status(403).json({msg: "You can't delete other's article"})
    }
})

router.get('/timeline/:id', async(req, res) => {
    const user = await User.findById(req.params.id)
    const userPosts = await Post.find({user: user._id})
    const friendPosts = await Promise.all(
        user.following.map((friendId) => {
          return Post.find({ user: friendId });
    }))
    const allPosts = userPosts.concat(...friendPosts)
    return res.status(200).json(allPosts)
})

router.get("/profile/:userName", async(req, res) => {
    const user = await User.findOne({name: req.params.userName})
    const userPosts = await Post.find({user: user._id})
    return res.status(200).json(userPosts)
})

module.exports = router
