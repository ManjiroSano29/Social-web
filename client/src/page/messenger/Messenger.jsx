import "./messenger.scss"
import { useContext, useState, useEffect, useRef } from "react"
import Picker from "emoji-picker-react"
import { AuthContext } from "../../context/authContext/AuthContext"
import User from "../../component/user/User"
import Message from "../../component/message/Message"
import axios from "axios"

const Messenger = ({socket}) => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const { user } = useContext(AuthContext)
    const [conversations, setConversations] = useState([])
    const [currentChat, setCurrentchat] = useState(null)
    const [messages, setMessages] = useState([])
    const [showPicker, setShowPicker] = useState(false)
    const [inputMsg, setInputMsg] = useState("")
    const [arrivalMessage, setArrivalMessage] = useState(null)
    const [friend, setFriend] = useState(null)
    const [type, setType] = useState(null)

    useEffect(() => {
        const getConversations = async() => {
            const res = await axios.get("http://localhost:5000/conversation/" + user._id)
            setConversations(res.data)
        }
        getConversations()
    }, [user._id])

    useEffect(() => {
        const getMessages = async() => {
            const res = await axios.get("http://localhost:5000/message/" + currentChat?._id)
            setMessages(res.data)
        }
        getMessages()
    }, [currentChat])

    const anotherId = currentChat?.member.find(m => m !== user._id)
    const handleClick = () => {
        anotherId && axios
                        .get("http://localhost:5000/user?userId=" + anotherId)
                        .then(res => setFriend(res.data))
        setType(currentChat)
    }
    useEffect(handleClick,[anotherId, currentChat])
   
    const onEmojiClick = (event, emojiObject) => {
        setInputMsg((prevInput) => prevInput + emojiObject.emoji)
    }

    const handleMessage = async(e) => {
        e.preventDefault()
        const receiverId = currentChat.member.find(m => m !== user._id)
        const message = {
            conversationId: currentChat._id,
            senderId: user._id,
            text: inputMsg
        }
        socket.emit("sendMessage", {
            senderId: user._id,
            receiverId,
            text: inputMsg
        })
        const res = await axios.post("http://localhost:5000/message", message)
        setMessages([...messages, res.data])
        setInputMsg("")
    }

    useEffect(() => {
        socket?.on("getMessage", data => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createAt: Date.now()
            })
        })
    }, [socket])
    
    useEffect(() => {
        arrivalMessage && 
        currentChat?.member.includes((arrivalMessage.sender)) &&
        setMessages(prev => [...prev, arrivalMessage])
    }, [arrivalMessage, currentChat])

    const scrollRef = useRef()
    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: "smooth"})
    }, [messages])    
    
    const messRef = useRef()

    return (
        <div className="messenger">
            <div className="boxChat">
                <div className="box_users">
                    <div className="box_name">
                        <div style={{display:"flex", alignItems:"center"}}>
                            <img 
                                src={user.profilePicture ? PF + user.profilePicture : "https://i.pinimg.com/originals/d0/eb/c7/d0ebc736a1a914c333814ab7a64182c0.jpg"}
                                alt=""
                                style={{borderRadius:"50%", height:"40px", width:"40px"}}
                            />
                            <p style={{marginLeft:"5px", fontSize:"17px", fontWeight:"bold", padding:"0 2px"}}>{user.name}</p>
                        </div>
                    </div>
                    <input 
                        className="box_search"
                        type="text"
                        placeholder="Search user"
                    />
                    <div style={{marginTop:"10px"}}>
                        {conversations.map((conversation, id) => {
                            return  <div
                                        ref={messRef} 
                                        key={id}
                                        onClick={() => {
                                                setCurrentchat(conversation) && handleClick()
                                            }}
                                        style={type===conversation?{backgroundColor:"whitesmoke"}:{}}
                                    >
                                        <User 
                                            conversation={conversation} 
                                            currentUser={user}
                                            arrivalMessage={arrivalMessage}
                                        />
                                    </div>
                        })}
                    </div>
                </div>
                <div className="box_box">
                    {currentChat ? 
                    <>
                        <div className="box_name">
                            <img 
                                src={friend?.profilePicture ? PF + friend?.profilePicture : "https://i.pinimg.com/originals/d0/eb/c7/d0ebc736a1a914c333814ab7a64182c0.jpg"}
                                alt=""
                                style={{height:"40px", width:"40px", borderRadius:"50%", marginLeft:"20px"}}
                            />
                            <p style={{marginLeft:"5px", fontSize:"17px"}}>{friend?.name}</p>
                        </div>
                        <div style={{overflowY:"auto", height:"82%"}}>
                            {messages.map((message, id) => {
                                return  <div ref={scrollRef}>
                                            <Message 
                                                message={message} 
                                                own={message.senderId === user._id} 
                                                currentUser={user}
                                                friend={friend}
                                                key={id}
                                            />
                                        </div>
                            })}
                        </div>
                        <form className="box_chat" onSubmit={handleMessage}>
                            <input
                                className="box_input"
                                placeholder="Texting..."
                                onChange={e => setInputMsg(e.target.value)}
                                value={inputMsg}
                            />  
                            <img 
                                className="box_icon"
                                src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
                                alt=""
                                onClick={() => setShowPicker(!showPicker)}
                            />
                        </form>
                        {showPicker && (
                            <Picker 
                                onEmojiClick={onEmojiClick} 
                                pickerStyle={{marginTop:"-65%"}} 
                            />
                        )} 
                    </> : <p className="noConversation">Open a conversation to start a chat</p>}
                </div>
            </div>
        </div>
    )
}

export default Messenger