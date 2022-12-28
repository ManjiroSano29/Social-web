import "./profile.scss"
import CakeIcon from '@mui/icons-material/Cake'
import WorkIcon from '@mui/icons-material/Work'
import { useEffect, useState, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/authContext/AuthContext"
import Feed from "../../component/feed/Feed"
import axios from "axios"

const Profile = () => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const { user, dispatch } = useContext(AuthContext)
    const userName = useParams().name
    const navigate = useNavigate()
    const [person, setPerson] = useState({})
    const [followed, setFollowEd] = useState(false)
    const [conversation, setConversation] = useState()

    useEffect(() => {
        const getUser = async() => {
            const res = await axios.get(`http://localhost:5000/user?userName=${userName}`)
            setPerson(res.data)
        }
        getUser()
    }, [userName])

    useEffect(() => {
        setFollowEd(user.following.includes(person._id))
    }, [user, person._id])

    const handleFollow = async() => {
        if(followed){
            await axios.put("http://localhost:5000/unfollow/" + person._id, {userId: user._id}, {
                headers: {
                    token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
                }
            })
            dispatch({type: "UNFOLLOW", payload: person._id})
        }else{
           await axios.put("http://localhost:5000/follow/" + person._id, {userId: user._id}, {
            headers: {
                token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
            }
        }) 
        dispatch({type: "FOLLOW", payload: person._id})
        }
        setFollowEd(!followed)
    }

    useEffect(() => {
        const getConversation = async() => {
            const res = await axios.get("http://localhost:5000/conversation/individual/" + person._id, {
                headers:{
                    token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
                }
            })
            setConversation(res.data)
        }
        getConversation()
    }, [person._id])
   
    const handleMessage = async() => {
        if(!conversation){
            const conv = {
                senderId: user._id,
                receiverId: person._id
            }
            await axios.post("http://localhost:5000/conversation", conv)
        }
        navigate("/messenger")
    }

    return (
        <>
        {user._id === person._id ? <>
            <div className="profile">
                <div className="profile_infors">
                    <div className="profile_infor">
                        <img 
                            src={user.profilePicture ? PF + user.profilePicture : "https://i.pinimg.com/originals/d0/eb/c7/d0ebc736a1a914c333814ab7a64182c0.jpg"}
                            alt=""
                            className="info_pic"
                        />
                        <div className="info_text">
                            <div className="info_username">
                                <span style={{fontSize:"30px"}}>{person.name}</span>
                                <span className="change_profile" onClick={() => navigate("/setting")}>Change profile</span>
                            </div>
                            <div className="info_person">
                                <div className="info_birthday">
                                    <CakeIcon />
                                    <p style={{marginLeft:"5px"}}>{person.birthday}</p>
                                </div>
                                <div className="info_career">
                                    <WorkIcon />
                                    <p style={{marginLeft:"5px"}}>{person.career}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                    <Feed userName={userName} className="feed"/>
            </div>
        </> : <>
            <div className="profile">
                <div className="profile_infors">
                    <div className="profile_infor">
                        <img 
                            src={person.profilePicture ? PF + person.profilePicture : "https://i.pinimg.com/originals/d0/eb/c7/d0ebc736a1a914c333814ab7a64182c0.jpg"}
                            alt=""
                            className="info_pic"
                        />
                        <div className="info_text">
                            <div className="info_username">
                                <span style={{fontSize:"30px"}}>{person.name}</span>
                                <span className="turn_message" onClick={handleMessage}>Message</span>
                                <span className="turn_follow" onClick={handleFollow}>{followed ? "Unfollow": "Follow"}</span>
                            </div>
                            <div className="info_person">
                                <div className="info_birthday">
                                    <CakeIcon />
                                    <p style={{marginLeft:"5px"}}>{person.birthday}</p>
                                </div>
                                <div className="info_career">
                                    <WorkIcon />
                                    <p style={{marginLeft:"5px"}}>{person.career}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
               <Feed userName={userName} className="feed"/>
            </div>
            </>}
        </>
    )
}

export default Profile
