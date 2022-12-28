import "./user.scss"
import { useState, useEffect } from "react"
import axios from "axios" 

const User = ({conversation, currentUser, arrivalMessage}) => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const [user, setUser] = useState(null)
    
    const anotherId = conversation.member.find(m => m !== currentUser._id)
    
    useEffect(() => {
        const getUser = async() => {
            const res = await axios.get("http://localhost:5000/user?userId=" + anotherId)
            setUser(res.data)
        }
        getUser()
    }, [anotherId])

    return (
        <>
            <div className="user">
                <img 
                    src={user?.profilePicture ? PF + user?.profilePicture : "https://i.pinimg.com/originals/d0/eb/c7/d0ebc736a1a914c333814ab7a64182c0.jpg"}
                    alt=""
                    className="user_img"
                />
                <div style={{marginLeft:"5px"}}>
                    <p className="user_name">{user?.name}</p>
                    {conversation.member.includes(arrivalMessage?.sender) && <p className="user_name">{arrivalMessage.text}</p>}
                </div>
            </div>  
        </>
    )
}

export default User