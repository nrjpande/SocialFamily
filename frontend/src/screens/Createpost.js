import React, { useState, useRef, useEffect } from "react";
import "../css/createpost.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Createpost() {
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");

  const tempImage =
    "http://res.cloudinary.com/cloudofneeraj/image/upload/v1701679857/szdougytl9q9htqwi6jy.png";
  const [url, setUrl] = useState(
    "http://res.cloudinary.com/cloudofneeraj/image/upload/v1701679857/szdougytl9q9htqwi6jy.png"
  );
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const notify = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  //we can create a post here
  useEffect(() => {
    if (url !== tempImage) {
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
      })
      .catch((err) => console.log(err));
    //saving post to databse
  };

  const loadFile = (event) => {
    var output = document.getElementById("uploadPhoto");
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {
      URL.revokeObjectURL(output.src);
    };
  };

  const fileInputRef = useRef(null);

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="createPost-option">
      <div className="createPostContainer">
        <div className="createPostOption">
          <h3>Create Post</h3>
          <div className="close-createPost"></div>
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
        <img src={url} id="uploadPhoto" alt="update-demo" />
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
              postDetails();
            }}
            className="postButton"
            type="submit"
          >
            <strong>Post</strong>
          </button>
        </div>
      </div>
    </div>
  );
}
