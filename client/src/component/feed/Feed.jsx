import "./feed.scss"
import Post from "../post/Post"
import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../../context/authContext/AuthContext"
import axios from "axios"

const Feed = ({userName, socket}) => {
    const [articles, setArticles] = useState([])
    const { user } = useContext(AuthContext)
    
    useEffect(() => {
        const fetchPosts = async () => {
          const res = userName
            ? await axios.get("http://localhost:5000/post/profile/" + userName)
            : await axios.get("http://localhost:5000/post/timeline/" + user._id)
          setArticles(
            res.data.sort((p1, p2) => {
              return new Date(p2.date) - new Date(p1.date)
            })
          )
        }
        fetchPosts()
      }, [userName, user._id])
      
      return (
          <div className="feed">
              {articles.map(article => (
                  <Post post={article} key={article._id} socket={socket}/>
              ))}
          </div>
      )
}

export default Feed