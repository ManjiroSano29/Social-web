const mongoose = require("mongoose")
const MessageSchema = new mongoose.Schema(
    {
        conversationId: String,
        senderId: String,
        text: String
    },
    {timestamps: true}
)

const Message = mongoose.model("Message", MessageSchema)
module.exports = Message