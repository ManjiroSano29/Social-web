import "./forgot.scss"
import { useState } from "react"
import axios from "axios"
const Forgot = () => {
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")

    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            const res = await axios.post("http://localhost:5000/forgot", {email: email})
            setMessage(res.data.msg)
            setError("")
        }catch(e){
            if(e.response && e.response.status >= 400){
                setError(e.response.data.msg)
           }
        }
    }

    return (
        <div className="forgot">
            <div className="forgot_container">
                <div className="forgot_title">
                    <p style={{fontSize:"25px", textAlign:"center", fontWeight:"bold"}}>Find your account</p>
                </div>
                <form className="forgot_form">
                    <p style={{fontSize:"20px"}}>Please enter your email to reset password</p>
                    <input 
                        name="email"
                        type="email"
                        className="forgot_input"
                        placeholder="Enter email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <button className="forgot_button" onClick={handleSubmit}>Send</button>
                    {error ?
                        <p style={{color:'red', fontSize:"20px"}}>{error}</p>: 
                        <p style={{color:'green', fontSize:"20px"}}>{message}</p>
                    }
                </form>
            </div>
        </div>
    )
}

export default Forgot