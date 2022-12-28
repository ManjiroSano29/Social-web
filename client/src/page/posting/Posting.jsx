import "./posting.scss"
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../../context/authContext/AuthContext"
import Picker from "emoji-picker-react"
import axios from "axios"

const Posting = () => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const [inputStr, setInputStr] = useState("")
    const [showPicker, setShowPicker] = useState(false)
    const [file, setFile] = useState()
    const { user } = useContext(AuthContext)

    const onEmojiClick = (event, emojiObject) => {
        setInputStr((prevInput) => prevInput + emojiObject.emoji)
    }

    useEffect(() => {
        return () => {
            file && URL.revokeObjectURL(file.preview)
        }
    },[file])

    const handlePreviewFile = (e) => {
        const file = e.target.files[0]
        file.preview = URL.createObjectURL(file)
        setFile(file) 
    }
    
    const handleSubmit = async(e) => {
        e.preventDefault()
        const newPost = {
            user: user._id,
            status: inputStr
        }

        if(file){
            const formData = new FormData()
            const fileName = Date.now() + file.name
            formData.append("name", fileName)
            formData.append("file", file)
            newPost.image = fileName
            try{
                await axios.post("http://localhost:5000/api/upload", formData)
            }catch(e){
                console.log(e)
            }
        }
        try{
            await axios.post("http://localhost:5000/post", newPost)
            window.location.reload()
        }catch(e){
            console.log(e)
        }
    }

    return (
        <div className="posting">
            <form className="posting_form">
                <div className="posting_status">
                    <img
                        className="posting_pro" 
                        src={user.profilePicture ? PF + user.profilePicture : "https://i.pinimg.com/originals/d0/eb/c7/d0ebc736a1a914c333814ab7a64182c0.jpg"}
                        alt=""
                    />
                    <input
                        className="posting_input"
                        name="status"
                        placeholder={"What is in your mind " + user.name + "?"}
                        onChange={e => setInputStr(e.target.value)}
                        value={inputStr}
                    />
                    <img 
                        className="posting_emoji_icon"
                        src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
                        alt=""
                        onClick={() => setShowPicker(!showPicker)}
                    />
                    {showPicker && (
                        <Picker pickerStyle={{position:"absolute", marginTop:"52vh", marginLeft:"40vw" }} onEmojiClick={onEmojiClick} />
                    )}
                </div>
                <hr />
                <div>
                    <label htmlFor="file" className="posting_add">
                        <AddPhotoAlternateIcon className="posting_icon"/>
                        <p className="posting_choose">Choose image from computer</p>
                        <input
                            style={{ display: "none" }}
                            type="file"
                            id="file"
                            onChange={handlePreviewFile}
                        />
                    </label>
                </div>
                {file && (
                    <img 
                        src={file.preview}
                        alt=""
                        style={{width:"100%", margin:"auto"}}
                    />
                )}
                <button className="posting_button" onClick={handleSubmit}>Submit</button>
            </form>
        </div> 
    )
}

export default Posting