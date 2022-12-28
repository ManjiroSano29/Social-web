const express = require("express")
const router = express.Router()
const Conversation = require("../../models/Conversation")
const User = require("../../models/User")
const verifyMiddleware = require("../../verify")

router.post("/", async(req, res) => {
    const conversation = new Conversation({
        member: [req.body.senderId, req.body.receiverId]
    })
    const conversationSaved = await conversation.save()
    return res.status(200).json(conversationSaved)
})

router.get("/:userId", async(req, res) => {
    const conversations = await Conversation.find(
        {member: { $in: [req.params.userId] }}
    )
    return res.status(200).json(conversations)
})

router.get("/individual/:id", verifyMiddleware, async(req, res) => {
    const conversation = await Conversation.findOne(
        {member: { $all: [req.user.id, req.params.id] }}
    )
    return res.status(200).json(conversation)
})

module.exports = router