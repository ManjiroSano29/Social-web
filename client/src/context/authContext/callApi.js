import { loginStart, loginSuccess, loginFailure } from "./AuthAction"
import axios from "axios"

const loginApi = async(user, dispatch) => {
    dispatch(loginStart())
    try{
        const res = await axios.post("http://localhost:5000/login", user)
        dispatch(loginSuccess(res.data))
    }catch(e){
        dispatch(loginFailure(e.response.data.msg))
    }
}

export { loginApi }