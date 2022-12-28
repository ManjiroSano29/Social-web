const loginStart = () => ({
    type: "LOGIN_START"
})

const loginSuccess = (user) => ({
    type: "LOGIN_SUCCESS",
    payload: user
})

const loginFailure = (e) => ({
    type: "LOGIN_FAILURE",
    payload: e
})

const logOut = () => ({
    type: "LOGOUT"
})

const follow = (userId) => ({
    type: "FOLLOW",
    payload: userId
})

const unFollow = (userId) => ({
    type: "UNFOLLOW",
    payload: userId
})

export {loginStart, loginSuccess, loginFailure, logOut, follow, unFollow}

