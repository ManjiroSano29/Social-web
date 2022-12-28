import "./register.scss"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const Register = () => {
    const navigate = useNavigate()

    const [user, setUser] = useState({
        email:"",
        name:"",
        birthday:"",
        career:"",
        phoneNumber:"",
        password:"",
        confirmPassword:""
    })
    
    const [error, setError] = useState("")
    const [serverError, setServerError] = useState("")

    const handleChange = (e) => {
        const {name, value} = e.target
        setUser({
            ...user,
            [name]: value
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        setError(validate(user))
        if(user.password.length >= 6 && user.password === user.confirmPassword){
            const userData = {
                email: user.email,
                name: user.name,
                birthday: user.birthday,
                career: user.career,
                phoneNumber: user.phoneNumber,
                password: user.password
            }
    
            try{
                await axios.post("http://localhost:5000/register", userData)
                navigate("/")
            }catch(e){
                if(e.response && e.response.status > 400){
                    setServerError(e.response.data.msg)
                }
            }
        }
    }
            
    const validate = (user) => {
        const errors = {}
        if(!user.email){
            errors.email = "Email is required"
        }else if(!/[a-z0-9]+@gmail.com/.test(user.email)){
            errors.email = "Please enter valid email"
        }

        if(!user.name){
            errors.name = "Name is required"
        }else if(user.name.length < 4){
            errors.name = "Your name is at least 4 characters"
        }else if(user.name.length > 20){
            errors.name = "Your name is up to 20 characters"
        }

        if(!user.birthday) errors.birthday = "Birthday is required"
        if(!user.career) errors.career = "Career is required"

        if(!user.phoneNumber){
            errors.phoneNumber = "Phone number is required"
        } else if(!/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.test(user.phoneNumber)){
            errors.phoneNumber = "Please enter valid phone number"
        }

        if(!user.password){
            errors.password = "Password is required"
        }else if(user.password.length < 6){
            errors.password = "Password is at least 6 characters"
        }

        if(!user.confirmPassword){
            errors.confirmPassword = "Confirm password is required"
        }else if(user.confirmPassword !== user.password){
            errors.confirmPassword = "Password is not confirmed"
        }
        return errors
    }
 
    return (
        <div className="register">
            <div className="register_container">
                <div style={{width:"200px", margin:"auto"}}>
                    <img 
                        src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png"
                        alt=""
                        className="register_image"
                    />
                </div>
                <form className="register_form">
                    <div className="register_required">
                        <label className="register_label" htmlFor="email">Email:</label>
                        <input
                            className="register_input"
                            name="email" 
                            type="email"
                            placeholder="Enter your email"
                            onChange={handleChange}
                            value={user.email}
                        />
                    </div>
                    {serverError ? <p className='register_error'>{serverError}</p> : <p className='register_error'>{error.email}</p>}

                    <div className="register_required">
                        <label className="register_label" htmlFor="name">Name:</label>
                        <input
                            className="register_input"
                            name="name" 
                            type="text"
                            placeholder="Enter your name"
                            onChange={handleChange}
                            value={user.name}
                        />
                    </div>
                    <p className="register_error">{error.name}</p>

                    <div className="register_required">
                        <label className="register_label" htmlFor="birthday">Birthday:</label>
                        <input
                            className="register_input" 
                            name="birthday"
                            type="date"
                            onChange={handleChange}
                            value={user.birthday}
                        />
                    </div>
                    <p className="register_error">{error.birthday}</p>

                    <div className="register_required">
                        <label className="register_label" htmlFor="career">Career:</label>
                        <input
                            className="register_input"
                            name="career" 
                            type="text"
                            placeholder="Enter your career"
                            onChange={handleChange}
                            value={user.career}
                        />
                    </div>
                    <p className="register_error">{error.career}</p>

                    <div className="register_required">
                        <label className="register_label" htmlFor="phoneNumber">Phone number:</label>
                        <input
                            className="register_input"
                            name="phoneNumber" 
                            type="text"
                            placeholder="Enter your phone number"
                            onChange={handleChange}
                            value={user.phoneNumber}
                        />
                    </div>
                    <p className="register_error">{error.phoneNumber}</p>

                    <div className="register_required">
                        <label className="register_label" htmlFor="password">Password:</label>
                        <input
                            className="register_input"
                            name="password" 
                            type="password"
                            placeholder="Enter your password"
                            onChange={handleChange}
                            value={user.password}
                        />
                    </div>
                    <p className="register_error">{error.password}</p>

                    <div className="register_required">
                        <label className="register_label" htmlFor="confirmPassword">Confirm password:</label>
                        <input
                            className="register_input"
                            name="confirmPassword" 
                            type="password"
                            placeholder="Confirm your password"
                            onChange={handleChange}
                            value={user.confirmPassword}
                        />
                    </div>
                    <p className="register_error">{error.confirmPassword}</p>

                    <button className="register_button" onClick={handleSubmit}>Register</button>
                </form>

                <div className="register_to_login">
                    <div className="to_login">
                        <span>You already have account?</span>
                        <span style={{marginLeft:"10px", color:"green", cursor:"pointer"}} onClick={() => navigate("/")}>Login</span>
                    </div>
                </div>
            </div>

            
        </div>
    )
}

export default Register