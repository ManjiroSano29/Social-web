import "./login.scss"
import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/authContext/AuthContext"
import { loginApi } from "../../context/authContext/callApi"

const Login = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { dispatch, error } = useContext(AuthContext)

    const handleSubmit = (e) => {
        e.preventDefault()
        loginApi({email, password}, dispatch)
    }

    return (
        <div className="login">
            <div style={{width: "50%", height:"100vh"}}>
                <img 
                    src="https://kol.com.vn/blog/wp-content/uploads/2021/09/5-cC3A1ch-kiE1BABFm-tiE1BB81n-trC3AAn-Instagram-nhanh-vC3A0-dE1BB85-lC3A0m-2021-KiE1BABFm-tiE1BB81n-101.png"
                    alt=""
                    className="login_image"
                    style={{width: "100%", height:"100%"}}
                />
            </div>
            <div style={{width:"50%"}}>
                <div className="login_container">
                    <form className="login_form">
                        <div style={{ width:"200px", margin:"auto"}}>
                            <img 
                                src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png"
                                alt=""
                            />
                        </div>
                        {error && <p style={{color:'red', width:"80%", margin:"auto"}}>{error}</p>}
                        <div className="login_input_div">
                            <input
                                className="login_input" 
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                onChange={e => setEmail(e.target.value)}
                                value={email}
                            />
                        </div>
                        <div className="login_input_div">    
                            <input
                                className="login_input" 
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                onChange={e => setPassword(e.target.value)}
                                value={password}
                            />
                        </div>
                        <button className="login_button" onClick={handleSubmit}>Login</button>
                        <p className="login_forget" onClick={() => navigate("/forgot")}>Forget password?</p>
                    </form>
                </div>
                <div className="login_to_register">
                    <div className="to_register">
                        <span>You don't have account?</span>
                        <span style={{marginLeft:"10px", color:"green", cursor:"pointer"}} onClick={() => navigate("/register")}>Click here</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login