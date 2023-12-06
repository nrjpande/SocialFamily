import React, { useEffect, useState } from "react";
import "../css/profile.css";
// import PostDetails from "./PostDetails";
import { useParams } from "react-router-dom";
import fetch from 'node-fetch';

export default function UserProfile() {
  const { userid } = useParams();
  const [isFollow, setIsFollow] = useState(false);
  const [user, setUser] = useState("");
  const [posts, setPosts] = useState([]);
  const defaultProfilePicture =
    "https://upload.wikimedia.org/wikipedia/commons/5/50/User_icon-cp.svg";

  //   follow user
  const followUser = (userId) => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ followId: userId }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setIsFollow(true);
      })
      .catch((err) => console.log(err));
  };

  //unfollow user
  const unfollowUser = (userId) => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ unfollowId: userId }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setIsFollow(false);
      })
      .catch((err) => console.log(err));
  };
  // we can click on the userName of the user to check out user's profile and follow/unfollow from there
  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setUser(result.user);
        setPosts(result.post);
        if (
          result.user.followers.includes(
            JSON.parse(localStorage.getItem("user"))._id
          )
        ) {
          setIsFollow(true);
        }
      })
      .catch((error) => console.log(error));
  }, [isFollow, userid]);

  return (
    <div className="profile">
      {/* profile frame */}
      <div className="profile-frame">
        {/* profile pic */}
        <div className="profile-pic">
          <img
            src={user.photo ? user.photo : defaultProfilePicture}
            alt="profile-pic"
          />
        </div>
        {/* profile data */}
        <div className="profile-data">
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <h1 className="nameInProfile">{user.userName}</h1>
            <button
              className="followBtn"
              onClick={() => {
                if (isFollow) {
                  unfollowUser(user._id);
                } else {
                  followUser(user._id);
                }
              }}
            >
              {isFollow ? "Unfollow" : "Follow"}
            </button>
          </div>

          <div
            className="profile-info"
            style={{ display: "flex", margin: "10px" }}
          >
            <p style={{ margin: "10px" }}> {posts.length} posts </p>
            <p style={{ margin: "10px" }}>
              {" "}
              {user.followers ? user.followers.length : 0} Followers{" "}
            </p>
            <p style={{ margin: "10px" }}>
              {" "}
              {user.following ? user.following.length : 0} Following{" "}
            </p>
          </div>
        </div>
      </div>
      <hr style={{ width: "90%", margin: "25px auto", opacity: "0.8" }} />
      <div className="gallery">
        {posts.map((pics) => {
          return (
            <img
              alt="sample"
              key={pics._id}
              src={pics.photo}
              className="item"
            />
          );
        })}
      </div>
    </div>
  );
}
