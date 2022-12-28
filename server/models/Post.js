const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema.Types

const PostSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },

    status: String,
    image: String,
    hearts: Array,

    comments: [{
        comment: {type: String, required: true},
        postedBy: {name: String, profilePicture: String},
        date: {type: Date, default: Date.now}
    }],

    date: {
        type: Date,
        default: Date.now
    },
})

const Post = mongoose.model("Post", PostSchema)
module.exports = Post