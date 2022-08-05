import React, { useEffect, useState } from "react";
import "./Home.scss";
import Axios from "axios";
//import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommentAlt,
  faThumbsDown,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";

//respondtata c'est l'array qu'on return
//avec uploadmap je rends les uploads individuels
function Home() {
  const [uploads, setUploads] = useState([]);
 
  useEffect(() => {
    if (!localStorage.getItem("loggedIn")) {
      localStorage.setItem("loggedIn", false);
    }
  }, []);

  useEffect(() => {
    Axios.get("http://localhost:5000/upload").then((response) => {
      setUploads(response.data);
    });
  }, []);

  const likePost = (id, key) => {
    var tempLikes = uploads;
    tempLikes[key].likes = tempLikes[key].likes + 1;

    Axios.post("http://localhost:5000/upload/like", {
      userLiking: localStorage.getItem("username"),
      postId: id,
    }).then((res) => {
      setUploads(tempLikes);
    });
  };
  
  return (
    <div className="Home">
      {uploads.map((val, key) => {
        return (
          <div className="Post">
            <div className="Image">
              <div className="Content">
                <img
                  src={`${process.env.REACT_APP_API_URL}upload/Images?nameImg=${val.image}`}
                />
              </div>
            </div>
            <div className="Content">
              <div className="title">
                {val.title} / by @{val.author}
              </div>
              <div className="description">{val.description}</div>
            </div>
            <div className="Engagement">
              <FontAwesomeIcon
                id="likeButton"
                icon={faThumbsUp}
                onClick={() => {likePost(val.id,key)
                
                }}
              />

              {val.likes}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
