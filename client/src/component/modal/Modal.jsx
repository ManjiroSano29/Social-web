import "./modal.scss"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import axios from "axios"

const Modal = ({modalStatus}) => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const [users, setUsers] = useState([])
    const [filterData, setFilterData] = useState([])
    const [ input, setInput ] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const getUsers = async() => {
            const res = await axios.get("http://localhost:5000/user/all")
            setUsers(res.data)
        }
        getUsers()
    }, [])

    const handleInput = (e) => {
        const searchWord = e.target.value
        setInput(searchWord)
        const wordFilter = users.filter(user => {
            return user.name.toLowerCase().includes(searchWord.toLowerCase())
        })
        if(searchWord === ""){
            setFilterData([])
        }else{
            setFilterData(wordFilter)
        }
    }

    const handleClear = () => {
        setFilterData([])
        setInput("")
    }

    return (
        <div className="modal_background">
            <div className="modal_container">
                <div className="modal_close_btn">
                    <button onClick={() => modalStatus(false)} className="modal_btn">X</button>
                </div>
                <div className="modal_search">
                    <input 
                        className="modal_input"
                        type="text"
                        placeholder="Search..."
                        value={input}
                        onChange={handleInput}
                    />
                    <div className="search_icon">
                        {filterData.length === 0 ? <SearchIcon /> : 
                        <CloseIcon onClick={handleClear} style={{cursor:"pointer"}}/>}
                    </div>
                </div>
                {filterData.length !== 0 && (
                    <div className="data_result">
                        {filterData.slice(0, 15).map((user) => {
                            return (
                                <div key={user._id} className="data_item" onClick={() => {
                                    navigate("/profile/" + user.name)
                                    modalStatus(false)
                                }}>
                                    <img 
                                        src={user.profilePicture ? PF + user.profilePicture : "https://i.pinimg.com/originals/d0/eb/c7/d0ebc736a1a914c333814ab7a64182c0.jpg"}
                                        alt=""
                                        style={{height:"40px", width:"40px", borderRadius:"50%"}}
                                    />
                                    <div className="data_infors">
                                        <p className="data_infor">{user.name}</p>
                                        <p className="data_infor" style={{color:"gray"}}>{user.email}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>)
                }
            </div>
        </div>
    )
}

export default Modal