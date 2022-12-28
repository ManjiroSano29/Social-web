import "./changeProfilePicture.scss"
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../../context/authContext/AuthContext"
import axios from "axios"

const ChangeProfilePicture = () => {
    const [file, setFile] = useState()
    const { user } = useContext(AuthContext)
    
    useEffect(() => {
        return () => {
            file && URL.revokeObjectURL(file.preview)
        }
    },[file])

    const handlePreviewFile = (e) => {
        const file = e.target.files[0]
        file.preview = URL.createObjectURL(file)
        setFile(file)
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        let update = {}
        if(file){
            const formData = new FormData()
            const fileName = Date.now() + file.name
            formData.append("name", fileName)
            formData.append("file", file)
            update.profilePicture = fileName
            try{
                await axios.post("http://localhost:5000/api/upload", formData)
            }catch(e){
                console.log(e)
            }
        }
        try{
            const res = await axios.put("http://localhost:5000/profile/" + user._id, update, {
                headers: {
                    token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
                }
            })
            let data = JSON.parse(localStorage.getItem("user"))
            data.profilePicture = res.data.profilePicture
            localStorage.setItem('user', JSON.stringify(data)) 
            window.location.reload()
        }catch(e){
            console.log(e)
        }
    }

    const handleDelete = async() => {
        try{
            await axios.put("http://localhost:5000/profile/delete/" + user._id, {profilePicture:""}, {
                headers: {
                    token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
                }
            })
            let data = JSON.parse(localStorage.getItem("user"))
            data.profilePicture = ""
            localStorage.setItem('user', JSON.stringify(data)) 
            window.location.reload()
        }catch(e){
            console.log(e)
        }
    }

    return (
        <div className="change_pic">
            <form className="change_pic_form">
                <p className="delete_profile_pic" onClick={handleDelete}>Delete your profile picture</p>
                <hr />
                <label htmlFor="file" className="let_change">
                    <AddPhotoAlternateIcon className="change_icon"/>
                    <p className="pic_choose">Choose profile picture from computer</p>
                    <input 
                        style={{display:"none"}}
                        type="file"
                        id="file"
                        onChange={handlePreviewFile}
                    />
                </label>
                {file && (
                    <img 
                        src={file.preview}
                        alt=""
                        style={{width:"100%", margin:"auto"}}
                    />
                )}
                <button className="change_button" onClick={handleSubmit}>Submit</button>
            </form>
        </div>
    )
}

export default ChangeProfilePicture