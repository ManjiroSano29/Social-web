import "./reset.scss"
import { useEffect, useState, Fragment } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"

const Reset = () => {
    const [valid, setValid] = useState(false)
    const [newPassword, setNewPassword] = useState("")
    const [confirmNew, setConfirmNew] = useState("")
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const param = useParams()
    const url = `http://localhost:5000/reset/${param.token}`

    useEffect(() => {
        const verify = async() => {
            await axios.get(url)
            setValid(true)
        }
        verify()
    }, [param, url])

    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            const res = await axios.put(url, {newPassword, confirmNew})
            setMessage(res.data.msg)
            setError("")
        }catch(e){
            if(e.response && e.response.status >= 400){
                setError(e.response.data.msg)
           }
        }
    }

    return (
        <Fragment>
            {valid ? (
                <div className="reset">
                    <form className="reset_container">
                        <h1>Reset password</h1>
                        <input 
                            name="newPassword"
                            className="reset_input"
                            placeholder="Enter new password"
                            type="password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                        />
                        <input 
                            name="confirmNew"
                            className="reset_input"
                            placeholder="Confirm new password"
                            type="password"
                            value={confirmNew}
                            onChange={e => setConfirmNew(e.target.value)}
                            style={{marginTop:"20px"}}
                        />
                        <button className="reset_button" onClick={handleSubmit}>Submit</button>
                        {error ?
                            <p style={{color:'red', fontSize:"20px"}}>{error}</p>: 
                            <p style={{color:'green', fontSize:"20px"}}>{message}</p>
                        }
                    </form>
                </div>
            ) : (
                <h1>404 Not found</h1>
            )}
        </Fragment>
    )
}
export default Reset