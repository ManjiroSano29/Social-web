import "./message.scss"
import {format} from "timeago.js"
const Message = ({message, own, currentUser, friend}) => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER

    return (
        <>
            <div className={own ? "message own" : "message"}>
                <div className="message_top">
                    {own ? 
                        <img 
                            src={currentUser?.profilePicture ? PF + currentUser?.profilePicture : "https://i.pinimg.com/originals/d0/eb/c7/d0ebc736a1a914c333814ab7a64182c0.jpg"}
                            alt=""
                            className="message_img"
                        /> : 
                        <img 
                            src={friend?.profilePicture ? PF + friend?.profilePicture : "https://i.pinimg.com/originals/d0/eb/c7/d0ebc736a1a914c333814ab7a64182c0.jpg"}
                            alt=""
                            className="message_img"
                        />
                    }
                    <div className="message_text">{message.text}</div>
                </div>
                <p className="message_bot">{format(message.createdAt)}</p>
            </div>
        </>
        
    )
}

export default Message