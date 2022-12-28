import "./editArticle.scss"
import { useLocation } from "react-router-dom"
import { useState, useContext } from "react"
import { AuthContext } from "../../context/authContext/AuthContext"
import Picker from "emoji-picker-react"
import axios from "axios"

const EditArticle = () => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const { user } = useContext(AuthContext)
    const location = useLocation()
    const post = location.state.post
    const [inputStr, setInputStr] = useState("")
    const [showPicker, setShowPicker] = useState(false)

    const onEmojiClick = (event, emojiObject) => {
        setInputStr((prevInput) => prevInput + emojiObject.emoji)
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        await axios.put("http://localhost:5000/post/" + post._id, {status: inputStr}, {
            headers: {
                token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
            }
        })
        window.location.reload()
    }

    return (
        <div className="edit">
            <p style={{fontSize:"30px"}}>Edit your article</p>
            <form className="edit_form">
                <div className="edit_status">
                    <img
                        className="edit_pro" 
                        src={user.profilePicture ? PF + user.profilePicture : "https://i.pinimg.com/originals/d0/eb/c7/d0ebc736a1a914c333814ab7a64182c0.jpg"}
                        alt=""
                    />
                    <input
                        className="edit_input"
                        name="status"
                        placeholder="Update status here"
                        onChange={e => setInputStr(e.target.value)}
                        value={inputStr}
                    />
                     <img 
                        className="edit_emoji_icon"
                        src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
                        alt=""
                        onClick={() => setShowPicker(!showPicker)}
                    />
                    {showPicker && (
                        <Picker pickerStyle={{position:"absolute", marginTop:"52vh", marginLeft:"40vw" }} onEmojiClick={onEmojiClick} />
                    )}
                </div>
                <hr />
                <img
                    className="edit_image" 
                    src={PF + post.image}
                    alt=""
                />
                <button className="edit_button" onClick={handleSubmit}>Submit</button>
            </form>
        </div>
    )
}

export default EditArticle