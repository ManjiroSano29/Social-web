import "./navbar.scss"
import HomeIcon from '@mui/icons-material/Home'
import SearchIcon from '@mui/icons-material/Search'
import InstagramIcon from '@mui/icons-material/Instagram'
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import { logOut } from "../../context/authContext/AuthAction"
import { AuthContext } from "../../context/authContext/AuthContext"
import Modal from "../modal/Modal"
import { Link, useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from "react"

const Navbar = ({socket}) => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const navigate = useNavigate()
    const { user, dispatch } = useContext(AuthContext)
    const [ displayModal, setDisplayModal ] = useState(false)
    const [ open, setOpen ] = useState(false)
    const [ notifications, setNotifications ] = useState([])
    const [ messNotifications, setMessNotifications] = useState([])

    const handleLogOut = () => {
        dispatch(logOut())
        navigate("/")
    }

    useEffect(() => {
        socket?.on("getNotification", (data) => {
          setNotifications((prev) => [...prev, data])
        })
    }, [socket])

    useEffect(() => {
        socket?.on("getMessage", (data) => {
            setMessNotifications((prev) => [...prev, data])
        })
    }, [socket])

    const displayNotifications = ({senderName, type}, index) => {
        let action
        if(type === 1){
             action = "unliked"
        }else if(type === 2){
            action = "liked"
        }else{
            action = "commented"
        }
        return (
            <div className="notification" key={index}>
                <img 
                    src={senderName.profilePicture ? PF + senderName.profilePicture : 
                    "https://i.pinimg.com/originals/d0/eb/c7/d0ebc736a1a914c333814ab7a64182c0.jpg"} 
                    alt=""
                    className="sender_img"
                />
                <p style={{fontWeight:"bold", marginLeft:"5px"}}>{senderName.name}</p>
                <p style={{marginLeft:"5px"}}>{`${action} your post`}</p>
            </div>
    )}


    const handleModal = () => {
        setDisplayModal(true)
        setOpen(false)
    }

    const handleHide = () => {
        setOpen(false)
    }

    const handleCount = () => {
        setNotifications([])
    }

    return (
        <div className="navbar">
            {displayModal && <Modal modalStatus={setDisplayModal}/>}
            {open ? <div className="navbar_feature" style={{marginTop:"35px"}}>
                <InstagramIcon className="navbar_feature_icon" />
            </div> : <div className="navbar_logo">
                <img 
                    src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png"
                    alt=""
                />
            </div>}

            {open &&
            <div className="notifications">
                <h1 style={{marginLeft:"20px"}}>Notifications</h1>
                {notifications.length > 0 ?
                <div>
                    <button className="nButton" onClick={handleCount}>Mark as read</button>
                    {notifications.slice(0).reverse().map((notification,index) => displayNotifications(notification, index))}
                </div> 
                : <div>
                    <img 
                        src="https://img.myloview.com/posters/single-continuous-line-drawing-heart-icon-perfect-love-symbol-valentine-s-day-sign-emblem-isolated-on-white-background-flat-style-for-graphic-and-web-design-logo-dynamic-one-line-draw-vector-400-280447636.jpg"
                        alt=""
                        className="notifications_img"
                    />
                    <p style={{textAlign:"center", marginTop:"-20%"}}>Activity in your posts</p>
                    <p style={{textAlign:"center"}}>When someone likes or comments in one of your posts, you'll see it here</p>
                </div>}
            </div>}

            <Link to={"/home"} className="link">
                <div className="navbar_feature" onClick={handleHide}>
                    <HomeIcon className="navbar_feature_icon"/>
                    <p className="navbar_feature_name">Home</p>
                </div>
            </Link>
            
            <div className="navbar_feature" onClick={handleModal}>
                <SearchIcon className="navbar_feature_icon"/>
                <p className="navbar_feature_name">Explore</p>
            </div>
            
            <Link to={"/messenger"} className="link" onClick={() => setMessNotifications([])}>
                <div className="navbar_feature" onClick={handleHide}>
                    <ChatBubbleOutlineOutlinedIcon className="navbar_feature_icon"/>
                    {messNotifications.length > 0 && <div className="messCount">{messNotifications.length}</div>}
                    <p className="navbar_feature_name">Message</p>
                </div>
            </Link>

            <div className="navbar_feature" onClick={() => setOpen(!open)}>
                <NotificationsNoneIcon className="navbar_feature_icon"/>
                {notifications.length > 0 && <div className="counter">{notifications.length}</div>}
                <p className="navbar_feature_name">Notifications</p>
             </div>
            
            <Link to="/create" className="link">
                <div className="navbar_feature" onClick={handleHide}>
                    <AddCircleOutlineOutlinedIcon className="navbar_feature_icon"/>
                    <p className="navbar_feature_name">Create</p>
                </div>
            </Link>

            <Link to={`/profile/${user.name}`} className="link">
                <div className="navbar_feature" onClick={handleHide}>
                    <img 
                        src={user.profilePicture ? PF + user.profilePicture : "https://i.pinimg.com/originals/d0/eb/c7/d0ebc736a1a914c333814ab7a64182c0.jpg"}
                        alt=""
                        style={{width:"35px", height:"35px", borderRadius:"50%", border:"2px solid black"}}
                    />
                    <p className="navbar_feature_name" style={{fontWeight:"bold"}}>Profile page</p>
                </div>
            </Link>

            <div className="navbar_feature" onClick={handleLogOut}>
                <LogoutOutlinedIcon className="navbar_feature_icon"/>
                <p className="navbar_feature_name">Log out</p>
            </div>

        </div>
    )
}

export default Navbar