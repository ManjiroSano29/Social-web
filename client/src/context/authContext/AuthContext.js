import AuthReducer from "./AuthReducer"
import { createContext, useEffect, useReducer } from "react"

const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    isFetching: false,
    error: ""
}

const AuthContext = createContext(initialState)

const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(AuthReducer, initialState)

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(state.user))
    }, [state.user])

    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                isFetching: state.isFetching,
                error: state.error,
                dispatch
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export {AuthContext, AuthContextProvider}

