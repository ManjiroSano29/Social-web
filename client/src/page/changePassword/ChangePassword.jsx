import "./changePassword.scss"
import { useState } from "react"
import axios from "axios"

const ChangePassword =  () => {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async(e) => {
        e.preventDefault()
        const userData = {
            currentPassword: currentPassword,
            newPassword: newPassword,
            confirmNewPassword: confirmNewPassword
        }

        try{
            const res = await axios.put("http://localhost:5000/changePassword", userData, {
                headers: {
                    token: "Bearer "+JSON.parse(localStorage.getItem("user")).accessToken
                }
            })
            setMessage(res.data.msg)
        }catch(e){
            if(e.response && e.response.status > 400){
                setError(e.response.data.msg)
            }
        }
    }

    return (
        <div className="change">
            <form className="change_form">
                <h1 className="change_title">Change password</h1>
                {
                    message ? 
                        <p style={{color:'green',marginTop:"-10px", marginLeft:"110px"}}>{message}</p> : 
                        <p style={{color:'red', marginTop:"-10px", marginLeft:"110px"}}>{error}</p>
                }
                <div className="change_detail">
                    <div className="change_field">
                        <input
                            placeholder="Current password" 
                            name="currentPassword"
                            type="password"
                            className="change_input"
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                        />
                    </div>
                    <div className="change_field">
                        <input
                            placeholder="New password" 
                            name="newPassword"
                            type="password"
                            className="change_input"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="change_field">
                        <input
                            placeholder="Confirm password" 
                            name="confirmNewPassword"
                            type="password"
                            className="change_input"
                            value={confirmNewPassword}
                            onChange={e => setConfirmNewPassword(e.target.value)}
                        />
                    </div>
                    <button className="change_button" onClick={handleSubmit}>Send</button>
                </div>
            </form>
        </div>
    )
}

export default ChangePassword