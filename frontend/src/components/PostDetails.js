import "../css/postDetail.css";
import "../css/home.css";
import React from "react";


//when a user goes into profile and click on any picture he can see comments and likes
export default function PostDetails({ item, toggleDetails }) {
  const defaultProfilePicture =
    "https://upload.wikimedia.org/wikipedia/commons/5/50/User_icon-cp.svg";

  // to get the createdAt time into a desired output
  const formatTimeDifference = (timestamp) => {
    const postTimestamp = new Date(timestamp);
    const currentTimestamp = new Date();
    const timeDifference = currentTimestamp - postTimestamp;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 1) {
      return `${days} days ago`;
    } else if (days === 1) {
      return "1 day ago";
    } else if (hours > 1) {
      return `${hours} hours ago`;
    } else if (hours === 1) {
      return "1 hour ago";
    } else if (minutes > 1) {
      return `${minutes} minutes ago`;
    } else if (minutes === 1) {
      return "1 minute ago";
    } else {
      return "a few seconds ago";
    }
  };

  return (
    <div className="showComment">
      <div className="container">
        <div className="postPic">
          <img src={item.photo} alt="comments" />
        </div>
        <div className="details">
          <div
            className="card-header"
            style={{
              borderBottom: "1px solid #00000029",
              justifyContent: "left",
            }}
          >
            <div className="card-pic">
              <img
                src={
                  item.postedBy.photo
                    ? item.postedBy.photo
                    : defaultProfilePicture
                }
                alt="avatar"
              />
            </div>
            <div>
              <h5>{item.postedBy.name}</h5>
              <h6>{formatTimeDifference(item.createdAt)}</h6>
            </div>
          </div>
          {/* comment section */}
          <div
            className="comment-section"
            style={{ borderBottom: "1px solid #00000029" }}
          >
            {item.comments.map((comment) => {
              return (
                <p className="comm">
                  <span className="commenter" style={{ fontWeight: "bolder" }}>
                    {comment.postedBy.name}{" "}
                  </span>
                  <span className="commentText">{comment.comment}</span>
                </p>
              );
            })}
          </div>
          <div className="card-content">
            <p>{item.likes.length} Likes</p>
            <p>{item.body}</p>
          </div>
          <div className="add-comment">
            <span className="material-symbols-outlined">mood</span>
            <input type="text" placeholder="Add a comment" />
            <button className="comment">Post</button>
          </div>
        </div>
      </div>
      <div className="close-comment">
        <span
          className="material-symbols-outlined material-symbols-outlined-comment"
          onClick={() => toggleDetails()}
        >
          close
        </span>
      </div>
    </div>
  );
}
