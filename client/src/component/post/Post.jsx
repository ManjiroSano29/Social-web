import "./post.scss"
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import InputEmoji from 'react-input-emoji'
import { useState, useEffect, useContext} from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/authContext/AuthContext"
import axios from "axios"

const Post = ({post, socket}) => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const { user } = useContext(AuthContext)
    const [person, setPerson] = useState({})
    const [liked, setLiked] = useState(false)
    const [likeNumber, setLikeNumber] = useState(post.hearts.length)
    const [click, setClick] = useState(false)
    const [comment, setComment] = useState("")
    const [commentNumber, setCommentNumber] = useState(post.comments.length)
    const [comments, setComments] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const getUser = async() => {
            const res = await axios.get(`http://localhost:5000/user?userId=${post.user}`)
            setPerson(res.data)
        }
        getUser()
    }, [post.user])
   
    useEffect(() => {
        const getComment = async() => {
            const res = await axios.get("http://localhost:5000/comment/personal/" + post._id, {
                headers: {
                    token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
                }
            })
            setComments(
                res.data.sort((p1, p2) => {
                    return new Date(p2.date) - new Date(p1.date)
                })
            )
        }
        getComment() 
    }, [post._id, comment])

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

    useEffect(() => {
        setLiked(post.hearts.includes(user._id))
    }, [post.hearts, user._id])

    const handleClick = () => {
        setClick(!click)
    }

    const handleDelete = async() => {
        await axios.delete("http://localhost:5000/post/" + post._id, {
            headers: {
                token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
            }
        })
        window.location.reload()
    }

    const handleComment = async(type) => {
        if(comment.length > 0 ) {
            await axios.put("http://localhost:5000/comment/" + post._id, {comment: comment, postedBy: user._id}, {
                headers: {
                    token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
                }
            })
            setCommentNumber(commentNumber + 1)
            post.user !== user._id && socket.emit("sendNotification", {
                senderName: user,
                receiverId: post.user,
                type
            })
        }
    }
    
    return (
        <div className="post">
            <div className="post_user">
                <img 
                    src={person.profilePicture ? PF + person.profilePicture : "https://i.pinimg.com/originals/d0/eb/c7/d0ebc736a1a914c333814ab7a64182c0.jpg"}
                    alt=""
                    className="post_user_img"
                />
                <p className="post_user_name" onClick={() => navigate("/profile/" + person.name)}>{person.name}</p>
                {user._id === person._id && 
                    <div className="post_options">
                        <MoreHorizIcon style={{cursor:"pointer"}} onClick={handleClick}/>
                        {click && <div className="post_option">
                                    <Link to="/edit" state={{post, person}} style={{textDecoration:"none"}}>
                                        <span style={{color:"green"}}>Edit</span>
                                    </Link>
                                    <span style={{color:"red", marginTop:"7px"}} onClick={handleDelete}>Delete</span>
                                  </div>
                        }
                    </div>}
            </div>
            <div className="post_detail">
                <img 
                    src={PF + post.image}
                    alt=""
                    style={{width:"100%", maxHeight:"100vh"}}
                />
                <div className="post_icons">
                    {liked ? <FavoriteRoundedIcon onClick={() => handleLike(1)} className="post_icon" style={{color: "red"}}/> : 
                        <FavoriteBorderOutlinedIcon onClick={() => handleLike(2)} className="post_icon"/>}
                    <Link to={"/article/" + post._id} state={{post, liked, likeNumber}}>
                        <ModeCommentOutlinedIcon className="post_icon" style={{color: "black"}}/>
                    </Link>
                    <ShareOutlinedIcon className="post_icon"/>
                </div>
                {likeNumber > 0 && <p className="post_likes">{likeNumber} likes</p>}
                <div className="post_status">
                    <span style={{fontWeight:"bold"}}>{person.name}</span>
                    <span style={{marginLeft:"5px"}}>{post.status}</span>
                </div>
                {commentNumber > 0 && 
                <Link to={"/article/" + post._id} state={{post, liked, likeNumber}} style={{textDecoration:"none"}}>
                    <p className="post_comments">See {commentNumber} comments</p>
                </Link>}
                <div className="post_status">
                    {comments.map(cmt => {
                        return (
                            <div className="post_cmt" key={cmt._id}>
                                <span style={{fontWeight:"bold"}}>{cmt.postedBy.name}</span>
                                <span style={{marginLeft:"5px"}}>{cmt.comment}</span>
                            </div>
                        )
                    })}
                </div>
                <form className="post_form_comment">
                    <InputEmoji
                        className="post_input" 
                        name="comment"
                        placeholder="Add comment..."
                        value={comment}
                        onChange={setComment}
                        cleanOnEnter
                        onEnter={() => handleComment(3)}
                    />
                </form>
            </div>
        </div>
    )
}

export default Post