import React, { useEffect, useState, useRef } from "react";
import "../css/home.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Home() {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");
  const [show, setShow] = useState(false);
  const [item, setItem] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [createPostShow, setCreatePostShow] = useState(false);

  const defaultProfilePicture =
    "https://upload.wikimedia.org/wikipedia/commons/5/50/User_icon-cp.svg";

  const [activeCardId, setActiveCardId] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [editImage, setEditImage] = useState("");
  const [updatePost, setUpdatePost] = useState(false);
  const [updatePostId, setUpdatePostId] = useState("");

  //home page has many function which we also have seperately

  const toggleDropdown = (postId) => {
    setActiveCardId(postId);
    setDropdownVisible(!dropdownVisible);
  };

  const closeDropdown = () => {
    setActiveCardId(null);
  };

  const notify = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  //update all post on the homepage
  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      navigate("./signup");
    }

    // fetching all posts
    fetch("/allPosts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result);
      })
      .catch((error) => console.log(error));

    //fetching all unfollowed people
    fetch("/recommendations", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setRecommendations(result);
      })
      .catch((err) => console.log(err));
  }, [data, navigate]);
  //Create new post

  //we can create a post here
  useEffect(() => {
    if (url) {
      fetch("/createPost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          body,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            notify(data.error);
          } else {
            notifyB("Successfully posted");
            navigate("/");
          }
        })
        .catch((err) => console.log(err));
    }
  }, [url, body, navigate]);

  //like a post
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
  //unlike a post
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
  //function to like a comment
  const likeComment = (commentId) => {
    fetch("/likeComment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        commentId: commentId,
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
  //function to like a comment
  const unlikeComment = (commentId) => {
    fetch("/unlikeComment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        commentId: commentId,
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

  //function to show/No show comments
  const toggleComment = (posts) => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
      setItem(posts);
    }
  };

  // when the edit post  or status bar clicked createPost will open
  const toggleCreatePost = () => {
    if (createPostShow) {
      setCreatePostShow(false);
    } else {
      setCreatePostShow(true);
      setEditImage(" ");
      setUpdatePost(false);
    }
  };

  //follow user from the recommendations
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
      .then((data) => window.location.reload())
      .catch((err) => console.log(err));
  };

  // handle click to copy the image link of the post to the clipboard
  const fileInputRef = useRef(null);
  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  //fetch all the details associated to a post
  const postDetails = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "merny-social");
    data.append("cloud_name", "cloudofneeraj");
    fetch("https://api.cloudinary.com/v1_1/cloudofneeraj/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
        window.location.reload();
      })
      .catch((err) => console.log(err));
    //saving post to databse
  };

  //to upload a image file to create or update post
  const loadFile = (event) => {
    var output = document.getElementById("uploadPhoto");
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {
      URL.revokeObjectURL(output.src);
    };
  };

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

  //to delete a post from the database only the person who posted this can delete the post
  const removePost = (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      fetch(`/deletePost/${postId}`, {
        method: "delete",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
        .then((res) => res.json())
        .then((result) => {
          setDropdownVisible(false);
          notifyB("Post Deleted!");
          console.log(result);
          navigate("/");
        })
        .catch((err) => console.log(err));
    }
  };
  // function to copy link of the image file of a post
  const copyLink = (link) => {
    navigator.clipboard
      .writeText(link)
      .then(function () {
        setDropdownVisible(false);
        notifyB("Text copied to clipboard!");
      })
      .catch(function (err) {
        console.error("Unable to copy text: ", err);
      });
  };

  // function to update a post
  const updatePostFun = (postId) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "merny-social");
    data.append("cloud_name", "cloudofneeraj");
    fetch("https://api.cloudinary.com/v1_1/cloudofneeraj/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.url);
        fetch(`/updatePost/${postId}`, {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
          body: JSON.stringify({
            body: body,
            photo: data.url,
          }),
        })
          .then((res) => res.json())
          .then((result) => {
            notifyB("Post Updated!");
            console.log(result);
            window.location.reload();
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  //function to set values of few elements while updating a post
  const editPost = (post) => {
    setDropdownVisible(false);
    setUpdatePost(true);
    setCreatePostShow(true);
    setEditImage(post.photo);
    setUpdatePostId(post._id);
  };

  // function to save a post to the user database
  const savePost = (postId) => {
    fetch("/savepost", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ postId: postId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.savedPost !== null) {
          notifyB("Post Saved!");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="create-post-and-user">
        <div className="postStatus">
          <img
            id="profilePic-status"
            src={currentUser.photo ? currentUser.photo : defaultProfilePicture}
            alt="profilePic"
          />
          <input
            id="statusText"
            type="text"
            className="statusText"
            placeholder={currentUser.userName + ", what are you thinking?"}
            onClick={() => toggleCreatePost()}
          />
        </div>
        <div style={{ display: "flex", margin: "5px" }}>
          <div>
            <img
              id="profilePic-status"
              src={
                currentUser.photo ? currentUser.photo : defaultProfilePicture
              }
              alt="profilePic"
            />
          </div>
          <div className="userDetails">
            <h9>{currentUser.userName}</h9>
            <h6 style={{ display: "block", margin: "0" }}>
              {currentUser.name}
            </h6>
          </div>
        </div>
      </div>
      {createPostShow && (
        <div className="createPost-option">
          <div className="createPostContainer">
            <div className="createPostOption">
              <h3>Create Post</h3>
              <div className="close-createPost">
                <span
                  className="material-symbols-outlined material-symbols-outlined-post"
                  onClick={() => toggleCreatePost()}
                >
                  close
                </span>
              </div>
            </div>
            <div className="textBoxPost">
              <textarea
                onChange={(e) => {
                  setBody(e.target.value);
                }}
                id="status-field"
                className="status-field"
                type="text"
                placeholder={
                  "Hi, " + currentUser.userName + "! What's on your mind?"
                }
              />
            </div>
            <img src={editImage} id="uploadPhoto" alt="demo" />
            <div>
              <span
                onClick={() => handleIconClick()}
                className="material-symbols-outlined material-symbols-outlined-upload"
              >
                photo_camera
              </span>
              <input
                style={{ display: "none" }}
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(event) => {
                  loadFile(event);
                  setImage(event.target.files[0]);
                }}
              />
              <span className="material-symbols-outlined material-symbols-outlined-upload">
                image
              </span>
            </div>
            <div>
              <button
                onClick={() => {
                  updatePost ? updatePostFun(updatePostId) : postDetails();
                }}
                className="postButton"
                type="submit"
              >
                {updatePost ? "Update" : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="dataAndrecommendations">
        <div className="home">
          {data.map((posts) => {
            if (!posts) {
              return <h3>There are no posts to show</h3>;
            }
            return (
              <div className="card">
                {/* card header */}
                <div className="card-header">
                  <div style={{ display: "flex" }}>
                    <div className="card-pic">
                      <img
                        src={
                          posts.postedBy.photo
                            ? posts.postedBy.photo
                            : defaultProfilePicture
                        }
                        alt="avatar"
                      />
                    </div>
                    <div id="post-options">
                      <div>
                        <h5>
                          <Link to={`/Profile/${posts.postedBy._id}`}>
                            {posts.postedBy.userName}
                          </Link>
                        </h5>
                        <h6>{formatTimeDifference(posts.createdAt)}</h6>
                      </div>
                    </div>
                    {dropdownVisible && posts._id === activeCardId && (
                      <div className="dropdown-content-home">
                        {posts.postedBy._id === currentUser._id && (
                          <Link
                            className="dropdownLinks"
                            onClick={() => editPost(posts)}
                          >
                            Edit Post
                          </Link>
                        )}
                        {posts.postedBy._id === currentUser._id && (
                          <Link
                            className="dropdownLinks"
                            onClick={() => removePost(posts._id)}
                          >
                            Remove Post
                          </Link>
                        )}
                        <Link
                          className="dropdownLinks copy-link"
                          onClick={() => copyLink(posts.photo)}
                        >
                          Copy Link
                        </Link>
                      </div>
                    )}
                  </div>
                  <div>
                    <span
                      className="dropdown-btn-home"
                      onClick={() => toggleDropdown(posts._id)}
                      onBlur={closeDropdown}
                    >
                      ...
                    </span>
                  </div>
                </div>
                {/* card image */}
                <p id="postBody">{posts.body}</p>
                <div className="card-image">
                  <img src={posts.photo} alt="posts" />
                </div>
                {/* card content */}
                <div className="card-content">
                  <div className="icons-container">
                    <div>
                      {posts.likes.includes(currentUser._id) ? (
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
                      <span
                        onClick={() => savePost(posts._id)}
                        className="material-symbols-outlined material-symbols-outlined-save"
                      >
                        photo_album
                      </span>
                      <span className="material-symbols-outlined">send</span>
                    </div>
                    <span className="material-symbols-outlined">bookmark</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: "bolder",
                    }}
                  >
                    <p>{posts.likes.length} Likes</p>
                    <p>{posts.comments.length} Comments</p>
                  </div>
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
                    placeholder="Add your comments.."
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value);
                    }}
                  />
                  <button
                    className="comment"
                    onClick={() => makeComment(comment, posts._id)}
                  >
                    Comment
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
                      <h7>
                        <strong>{item.postedBy.userName}</strong>
                      </h7>
                      <h6>{formatTimeDifference(item.createdAt)}</h6>
                    </div>
                  </div>
                  {/* comment section */}
                  <div
                    className="comment-section"
                    style={{
                      borderBottom: "1px solid #00000029",
                      lineHeight: "1px",
                    }}
                  >
                    {item.comments
                      .sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                      )
                      .map((comment) => {
                        return (
                          <div className="comments-content">
                            <div>
                              <p className="comm">
                                <img
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    marginRight: "5px",
                                    borderRadius: "20px",
                                  }}
                                  src={comment.postedBy.photo}
                                  alt="avatar"
                                />
                                <span
                                  className="commenter"
                                  style={{
                                    fontWeight: "bolder",
                                    marginRight: "5px",
                                  }}
                                >
                                  {comment.postedBy.userName}
                                </span>
                              </p>
                            </div>
                            <div
                              style={{
                                display: "block",
                                lineHeight: "1px",
                                border: "1px solid lightGrey",
                                borderRadius: "5px",
                                fontSize: "12px",
                                backgroundColor: "lightGrey",
                                marginBottom: "5px",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  padding: "5px",
                                }}
                              >
                                <p
                                  className="commentText"
                                  style={{
                                    fontSize: "14px",
                                  }}
                                >
                                  {comment.comment}
                                </p>
                                <div>
                                  {/* like comment */}
                                  {comment.likes.includes(currentUser._id) ? (
                                    <span
                                      className="material-symbols-outlined material-symbols-outlined-red"
                                      onClick={() => {
                                        unlikeComment(comment._id);
                                      }}
                                    >
                                      favorite
                                    </span>
                                  ) : (
                                    <span
                                      className="material-symbols-outlined"
                                      onClick={() => {
                                        likeComment(comment._id);
                                      }}
                                    >
                                      favorite
                                    </span>
                                  )}
                                </div>
                              </div>
                              {/*comments display for likes count and reply option*/}
                              <div style={{ display: "flex" }}>
                                <p
                                  className="commentTime"
                                  style={{ fontSize: "10px" }}
                                >
                                  {formatTimeDifference(comment.createdAt)}
                                </p>
                                <p
                                  style={{
                                    marginLeft: "10px",
                                    marginRight: "10px",
                                    cursor: "pointer",
                                    fontWeight: "bolder",
                                  }}
                                >
                                  {comment.likes.length} Likes
                                </p>
                                <p
                                  style={{
                                    cursor: "pointer",
                                    fontWeight: "bolder",
                                  }}
                                >
                                  Reply
                                </p>
                              </div>
                            </div>
                          </div>
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
                      Comment
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

        <div className="recommendations">
          <h3 style={{ color: "blue", textAlign: "left" }}>Recommendations</h3>
          {recommendations.map((user) => {
            if (!user) {
              return <div>hello</div>;
            }
            return (
              <div className="userToFollow">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    margin: "5px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      id="profilePic-status"
                      src={user.photo ? user.photo : defaultProfilePicture}
                      alt="profilePic"
                    />
                  </div>
                  <div className="userDetails">
                    <h9>{user.userName}</h9>
                    <h6 style={{ display: "block" }}>{user.name}</h6>
                  </div>
                </div>
                <div style={{ margin: "5px", marginLeft: "auto" }}>
                  <button
                    className="follow-btn"
                    onClick={() => followUser(user._id)}
                  >
                    {" "}
                    Follow{" "}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
