import "./app.scss"
import Navbar from "./component/navbar/Navbar"
import Login from "./page/login/Login"
import Register from "./page/register/Register"
import Home from "./page/home/Home"
import Profile from "./page/profile/Profile"
import Setting from "./page/setting/Setting"
import ChangePassword from "./page/changePassword/ChangePassword"
import Posting from "./page/posting/Posting"
import ChangeProfilePicture from "./page/changeProfilePicture/ChangeProfilePicture"
import Article from "./page/article/Article"
import EditArticle from "./page/editArticle/EditArticle"
import Messenger from "./page/messenger/Messenger"
import Forgot from "./page/forgot/Forgot"
import Reset from "./page/reset/Reset"
import ScrollToTop from "./component/ScrollToTop"
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useContext, useState, useEffect } from "react"
import { AuthContext } from "./context/authContext/AuthContext"
import { io } from "socket.io-client"

function App() {
  const { user } = useContext(AuthContext)
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    setSocket(io("http://localhost:8000"));
  }, []);

  useEffect(() => {
    socket?.emit("newUser", user?._id);
  }, [socket, user?._id])
  
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path='/' element={user ? <Navigate to="/home"/> : <Login />} />
          <Route path='/register' element={user ? <Navigate to="/home"/> : <Register />} />
          <Route path='/forgot' element={user ? <Navigate to="/home"/> : <Forgot />} />
          <Route path='/reset/:token' element={user ? <Navigate to="/home"/> : <Reset />} />
        </Routes>

        {user && (
          <>
            <ScrollToTop />
            <Navbar socket={socket}/>
            <Routes>
              <Route exact path="/home" element={<Home socket={socket}/>} />
              <Route path="/create" element={<Posting />} />
              <Route path="/profile/:name" element={<Profile />} />
              <Route path="/setting" element={<Setting />} />
              <Route path="/changePassword" element={<ChangePassword />} />
              <Route path="/changeProfilePicture" element={<ChangeProfilePicture />} />
              <Route path="/edit" element={<EditArticle />} />
              <Route path="/article/:id" element={<Article socket={socket}/>} />
              <Route path="/messenger" element={<Messenger socket={socket}/>} />
            </Routes>
          </>
        )}
      </Router>
    </div>
  );
}

export default App;
