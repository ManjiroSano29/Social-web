import "./article.scss"
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined'
import { useLocation } from "react-router-dom"
import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../../context/authContext/AuthContext"
import InputEmoji from 'react-input-emoji'
import axios from "axios"

const Article = ({socket}) => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const { user } = useContext(AuthContext)
    const [person, setPerson] = useState({})
    const location = useLocation()
    const post = location.state.post
    const [likeNumber, setLikeNumber] = useState(location.state.likeNumber)
    const [liked, setLiked] = useState(location.state.liked)
    const [comment, setComment] = useState("")
    const [comments, setComments] = useState([])
    
    useEffect(() => {
        const getUser = async() => {
            const res = await axios.get(`http://localhost:5000/user?userId=${post.user}`)
            setPerson(res.data)
        }
        getUser()
    }, [post.user])

    const handleLike = async(type) => {
        await axios.put("http://localhost:5000/heart/" + post._id, { userId: user._id }, {
            headers: {
                token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
            }
        })
        setLiked(!liked)
        setLikeNumber(liked ? likeNumber - 1 : likeNumber + 1)
        post.user !== user._id && socket.emit("sendNotification", {
            senderName: user,
            receiverId: post.user,
            type
        })
    }

    const handleComment = async(type) => {
        if(comment.length > 0 ) {
            await axios.put("http://localhost:5000/comment/" + post._id, {comment: comment, postedBy: user._id}, {
                headers: {
                    token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
                }
            })
            post.user !== user._id && socket.emit("sendNotification", {
                senderName: user,
                receiverId: post.user,
                type
            })
        }
    }

    useEffect(() => {
        const getComments = async() => {
            const res = await axios.get("http://localhost:5000/comment/" + post._id)
            setComments(
                res.data.sort((p1, p2) => {
                    return new Date(p2.date) - new Date(p1.date)
                })
            )
        }
        getComments()
    }, [post._id, comment])
    
    return (
        <div className="article">
            <div className="article_detail">
                <img 
                    className="article_image"
                    src={PF + post.image}
                    alt=""
                />
                <div className="article_comments">
                    <div className="article_user">
                        <img 
                            className="article_user_pro"
                            src={person.profilePicture ? PF + person.profilePicture : "https://i.pinimg.com/originals/d0/eb/c7/d0ebc736a1a914c333814ab7a64182c0.jpg"}
                            alt=""
                        />
                        <p className="article_user_name">{person.name}</p>
                        <p style={{marginLeft:"10px"}}>{post.status}</p>
                    </div>
                    {comments.length === 0 ? <div className="no_comment"><h2>No comments yet</h2></div> : 
                    <div className="article_cmt">
                        {comments.map(cmt => {
                            return (
                                <div className="display_comment" key={cmt._id}>
                                    <img 
                                        src={cmt.postedBy.profilePicture ? PF + cmt.postedBy.profilePicture : "https://i.pinimg.com/originals/d0/eb/c7/d0ebc736a1a914c333814ab7a64182c0.jpg"}
                                        alt=""
                                        style={{height:"35px", width:"35px", borderRadius:"50%"}}
                                    />
                                    <p style={{fontWeight:"bold", marginLeft:"10px"}}>{cmt.postedBy.name}</p>
                                    <p style={{marginLeft:"10px"}}>{cmt.comment}</p>
                                </div>
                            )
                        })}
                    </div>}
    
                    <form className="article_form">
                        <div style={{height:"80px"}}>
                            <div>
                                {liked ? 
                                <FavoriteRoundedIcon onClick={() => handleLike(1)} style={{color: "red", cursor:"pointer", fontSize:"30px"}}/> : 
                                <FavoriteBorderOutlinedIcon onClick={() => handleLike(2)} style={{cursor:"pointer", fontSize:"30px"}}/>}
                                <ModeCommentOutlinedIcon style={{marginLeft:"20px", fontSize:"30px", cursor:"pointer"}}/>
                            </div>
                            {likeNumber > 0 && <p style={{fontWeight:"bold"}}>{likeNumber} likes</p>}
                        </div>
                        
                        <InputEmoji
                            className="article_input" 
                            name="comment"
                            placeholder="Add comment..."
                            value={comment}
                            onChange={setComment}
                            cleanOnEnter
                            onEnter={handleComment}
                        />
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Article