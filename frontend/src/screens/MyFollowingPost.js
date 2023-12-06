import React, { useEffect, useState } from "react";
import "../css/home.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import fetch from 'node-fetch';

export default function MyFollowingPost() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");
  const [show, setShow] = useState(false);
  const [item, setItem] = useState([]);

  // const notify = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      navigate("./signup");
    }
    // fetching all my following
    fetch("/myfollowingpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch((error) => console.log(error));
  }, [navigate]);
  //function to like a post
  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id === result._id) {
            result.postedBy = posts.postedBy;
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
        console.log(result);
      })
      .catch((error) => console.log(error));
  };
  //function to unlike a liked post
  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id === result._id) {
            result.postedBy = posts.postedBy;
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
        console.log(result);
      })
      .catch((error) => console.log(error));
  };

  // function to make comment
  const makeComment = (text, id) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text: text,
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id === result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
        setComment("");
        notifyB("Comment Posted");
        console.log(result);
      })
      .catch((error) => console.log(error));
  };

  //function to show/No show comments
  const toggleComment = (posts) => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
      setItem(posts);
    }
  };

  return (
    <div className="home">
      <div className="postStatus">
        <div className="profilePic"></div>
        <div className="status">
          <input type="text" className="statusText" placeholder="" />
        </div>
      </div>
      {data.map((posts) => {
        if (!posts) {
          return <h3>There are no posts to show</h3>;
        }
        return (
          <div className="card">
            {/* card header */}
            <div className="card-header">
              <div className="card-pic">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/50/User_icon-cp.svg"
                  alt="avatar"
                />
              </div>
              <h5>
                <Link to={`/Profile/${posts.postedBy._id}`}>
                  {posts.postedBy.name}
                </Link>
              </h5>
            </div>
            {/* card image */}
            <div className="card-image">
              <img src={posts.photo} alt="posts" />
            </div>
            {/* card content */}
            <div className="card-content">
              {posts.likes.includes(
                JSON.parse(localStorage.getItem("user"))._id
              ) ? (
                <span
                  className="material-symbols-outlined material-symbols-outlined-red"
                  onClick={() => {
                    unlikePost(posts._id);
                  }}
                >
                  favorite
                </span>
              ) : (
                <span
                  className="material-symbols-outlined"
                  onClick={() => {
                    likePost(posts._id);
                  }}
                >
                  favorite
                </span>
              )}
              <p>{posts.likes.length} Likes</p>
              <p>{posts.body}</p>
              <p
                style={{ fontWeight: "bold", cursor: "pointer" }}
                onClick={() => {
                  toggleComment(posts);
                }}
              >
                View all comments
              </p>
            </div>
            {/* add comment */}
            <div className="add-comment">
              <span className="material-symbols-outlined">mood</span>
              <input
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
              />
              <button
                className="comment"
                onClick={() => makeComment(comment, posts._id)}
              >
                Post
              </button>
            </div>
          </div>
        );
      })}

      {show && (
        <div className="showComment">
          <div className="container">
            <div className="postPic">
              <img src={item.photo} alt="comments" />
            </div>
            <div className="details">
              <div
                className="card-header"
                style={{ borderBottom: "1px solid #00000029" }}
              >
                <div className="card-pic">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/5/50/User_icon-cp.svg"
                    alt="avatar"
                  />
                </div>
                <h5>{item.postedBy.name}</h5>
              </div>
              {/* comment section */}
              <div
                className="comment-section"
                style={{ borderBottom: "1px solid #00000029" }}
              >
                {item.comments.map((comment) => {
                  return (
                    <p className="comm">
                      <span
                        className="commenter"
                        style={{ fontWeight: "bolder" }}
                      >
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
                <input
                  type="text"
                  placeholder="Add a comment"
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                />
                <button
                  className="comment"
                  onClick={() => {
                    makeComment(comment, item._id);
                    toggleComment();
                  }}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
          <div className="close-comment">
            <span
              className="material-symbols-outlined material-symbols-outlined-comment"
              onClick={() => toggleComment()}
            >
              close
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
