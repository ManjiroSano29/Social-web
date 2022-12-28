const AuthReducer = (state, action) => {
    switch(action.type){
        case "LOGIN_START":
            return {
                user: null,
                isFetching: true,
                error: ""
            }
        
        case "LOGIN_SUCCESS":
            return {
                user: action.payload,
                isFetching: false,
                error: ""
            }

        case "LOGIN_FAILURE":
            return {
                user: null,
                isFetching: false,
                error: action.payload
            }

        case "LOGOUT":
            return {
                user: null,
                isFetching: false,
                error: ""
            }
        
        case "FOLLOW":
            return {
                ...state,
                user: {
                    ...state.user,
                    following: [...state.user.following, action.payload]
                }
            }

        case "UNFOLLOW":
            return {
                ...state,
                user: {
                    ...state.user,
                    following: state.user.following.filter(flw => flw !== action.payload)
                }
            } 
               
        default:
            throw new Error ("Invalid action")
    }
}

export default AuthReducer