import "./setting.scss"
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'
import { useNavigate } from "react-router-dom"
import { useContext, useState } from "react"
import { AuthContext } from "../../context/authContext/AuthContext"
import axios from "axios"

const Setting = () => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)
    const [userUpdate, setUserUpdate] = useState(user)
    
    const handleChange = (e) => {
        const {name, value} = e.target
        setUserUpdate({
            ...userUpdate,
            [name]: value
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        const userUpdateData = {
            name: userUpdate.name,
            birthday: userUpdate.birthday,
            career: userUpdate.career,
            phoneNumber: userUpdate.phoneNumber,
            location: userUpdate.location,
            bio: userUpdate.bio,
            sex: userUpdate.sex
        }

        await axios.put("http://localhost:5000/user/" + userUpdate._id, userUpdateData, {
            headers: {
                token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
            }
        })

        let data = JSON.parse(localStorage.getItem("user"))
        Object.keys(userUpdate).forEach((key) => {
            data[key] = userUpdate[key]
        })
        localStorage.setItem('user', JSON.stringify(data))
        window.location.reload()
    }

    return (
        <div className="setting">
            <form className="setting_form">
                <div className="setting_profile">
                    <img 
                        src={user.profilePicture ? PF + user.profilePicture : "https://i.pinimg.com/originals/d0/eb/c7/d0ebc736a1a914c333814ab7a64182c0.jpg"}
                        alt=""
                        style={{width:"40px", height:"40px", borderRadius:"50%"}}
                    />
                    <div className="setting_names">
                        <p className="setting_name" style={{fontSize:"20px"}}>{userUpdate.name}</p>
                        <p className="setting_name" style={{fontSize:"15px", color:"blue", cursor:"pointer"}} onClick={()=> navigate("/changeProfilePicture")}>Change profile picture</p>
                    </div>
                </div>
                <div className="setting_detail">
                     <div className="setting_field">
                        <label className="setting_label" htmlFor="name">User name:</label>
                        <input 
                            type="text"
                            name="name"
                            className="setting_input"
                            onChange={handleChange}
                            value={userUpdate.name}
                        />
                    </div>
                    <div className="setting_field">
                        <label className="setting_label" htmlFor="birthday">Birthday:</label>
                        <input 
                            type="date"
                            name="birthday"
                            className="setting_input"
                            onChange={handleChange}
                            value={userUpdate.birthday}
                        />
                    </div>
                    <div className="setting_field">
                        <label className="setting_label" htmlFor="career">Career:</label>
                        <input 
                            type="text"
                            name="career"
                            className="setting_input"
                            onChange={handleChange}
                            value={userUpdate.career}
                        />
                    </div>
                    <div className="setting_field">
                        <label className="setting_label" htmlFor="phoneNumber">Phone number:</label>
                        <input 
                            type="text"
                            name="phoneNumber"
                            className="setting_input"
                            onChange={handleChange}
                            value={userUpdate.phoneNumber}
                        />
                    </div>
                    <div className="setting_field">
                        <label className="setting_label" htmlFor="location">Location:</label>
                        <input 
                            type="text"
                            name="location"
                            className="setting_input"
                            onChange={handleChange}
                            value={userUpdate.location}
                        />
                    </div>
                    <div className="setting_field">
                        <label className="setting_label" htmlFor="bio">Bio:</label>
                        <textarea 
                            type="text"
                            name="bio"
                            className="setting_input"
                            onChange={handleChange}
                            value={userUpdate.bio}
                            style={{height:"110px"}}    
                        />
                    </div>
                    <div className="setting_field">
                        <label className="setting_label" htmlFor="sex">Sex:</label>
                        <select className="setting_input" name="sex" id="sex" onChange={handleChange} value={userUpdate.sex}>
                            <option value="don't want to reveal">Don't want to reveal</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <button className="setting_button" onClick={handleSubmit}>Send</button>
                </div>
                <div className="setting_password" onClick={() => navigate("/changePassword")}>
                    <p>Change your password</p>
                    <DoubleArrowIcon />
                </div>
            </form>
        </div>
    )
}

export default Setting