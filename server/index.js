const express = require("express")
const app = express()
const mongoose = require("mongoose")
const path = require("path")
const dotenv = require("dotenv")
dotenv.config()
const bodyParser = require("body-parser")
const multer = require("multer")
const cors = require("cors")
const authRoute = require("./routes/auth/auth")
const userRoute = require("./routes/user/user")
const profilePictureRoute = require("./routes/user/profilePicture")
const followRoute = require("./routes/user/follow")
const postRoute = require("./routes/post/post")
const heartRoute = require("./routes/post/heart")
const commentRoute = require("./routes/post/comment")
const conversationRoute = require("./routes/messenger/conversation")
const messageRoute = require("./routes/messenger/message")
const changeRoute = require("./routes/password/change")
const resetRoute = require("./routes/password/reset")

app.use(cors())
mongoose.connect(process.env.MONGO_URL);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use("/images", express.static(path.join(__dirname, "public/images")))

app.use("/", authRoute)
app.use("/user", userRoute)
app.use("/profile", profilePictureRoute)
app.use("/", followRoute)
app.use("/post", postRoute)
app.use("/comment", commentRoute)
app.use("/heart", heartRoute)
app.use("/conversation",  conversationRoute)
app.use("/message",  messageRoute)
app.use("/changePassword", changeRoute)
app.use("/", resetRoute)

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name)
    }
})

const upload = multer({ storage: storage })

app.post("/api/upload", upload.single("file"), (req, res) => {
    try{
        return res.status(200).json("Upload successfully")
    }catch(e){
        console.log(e)
    }
})

app.listen(5000, () => {
    console.log("Server is starting at http://localhost:5000")
})