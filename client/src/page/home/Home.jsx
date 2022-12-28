import "./home.scss"
import Feed from "../../component/feed/Feed"

const Home = ({socket}) => {
    return (
        <div className="home">
            <div className="home_title">
                <img 
                    src="https://cdn.tgdd.vn/hoi-dap/1356493/Thumbnail/the-gioi-di-dong-instagram-la-gi.jpg"
                    alt=""
                    style={{width:"100.4%", height:"200px"}}
                />
            </div>
            <Feed socket={socket}/>            
        </div>
    )
}

export default Home