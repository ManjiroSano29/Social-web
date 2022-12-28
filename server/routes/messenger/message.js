const express = require("express")
const router = express.Router()
const Message = require("../../models/Message")

router.post("/", async(req, res) => {
    const message = new Message({
        conversationId: req.body.conversationId,
        senderId: req.body.senderId,
        text: req.body.text
    })
    const messageSaved = await message.save()
    res.status(200).json(messageSaved) 
})

router.get("/:conversationId", async(req, res) => {
    const message = await Message.find({conversationId: req.params.conversationId})
    return res.status(200).json(message)
})

module.exports = router