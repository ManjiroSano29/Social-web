const mongoose = require("mongoose")
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true,
        min: 4,
        max: 20
    },

    birthday: {
        type: String,
        required: true
    },

    career: {
        type: String,
        required: true
    },

    phoneNumber: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true,
        min: 6
    },

    location: {
        type: String,
    },

    sex: {
        type: String,
    },
    
    profilePicture: {
        type: String,
        default:''
        
    },
    
    following: {
        type: Array,
        default:[]
    },

    followers: {
        type: Array,
        default: []
    },
    
    isAdmin: {
        type: Boolean,
        default: false
    },

    date: {
        type: Date,
        default: Date.now
    },

    resetPasswordToken: String,
    resetPasswordExpires: Date
})

const User = mongoose.model("User", UserSchema)
module.exports = User