import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

export default function ProfilePic({ changeProfile }) {
  const hiddenFileInput = useRef(null);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  const notify = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  // posting image to cloudinary
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
      .then((data) => setUrl(data.url))
      .catch((err) => console.log(err));
    //saving post to databse
  };

  //   add profile pic to database
  const postPic = () => {
    fetch("/uploadProfilePic", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        pic: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          notify(data.error);
        } else {
          notifyB("Profile Pic Changed");
          console.log(data);
          changeProfile();
          window.location.reload();
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (image) postDetails();
  }, [image]);

  // cloudianry url is generated we will upload it to database as photo of the user
  useEffect(() => {
    if (url) {
      postPic();
      const storedData = JSON.parse(localStorage.getItem("user"));
      storedData.photo = url;
      localStorage.setItem("user", JSON.stringify(storedData));
    } else {
      // Retrieve the object from localStorage
      const storedData = JSON.parse(localStorage.getItem("user"));
      storedData.photo =
        "https://upload.wikimedia.org/wikipedia/commons/5/50/User_icon-cp.svg";
      localStorage.setItem("user", JSON.stringify(storedData));
    }
  }, [url]);

  return (
    <div className="profilePic darkBg">
      <div className="changePic centered">
        <div>
          <h2>Change Profile Photo</h2>
        </div>
        <div
          className="changePhoto"
          style={{ borderTop: "1px solid #00000030" }}
        >
          <button
            className="upload-btn"
            style={{ color: "#1EA1F7" }}
            onClick={handleClick}
          >
            Upload Photo
          </button>
          <input
            type="file"
            ref={hiddenFileInput}
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
          />
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          {" "}
          <button
            onClick={() => {
              setUrl(null);
              postPic();
            }}
            className="upload-btn"
            style={{ color: "#ed4956" }}
          >
            {" "}
            Remove Current Photo{" "}
          </button>
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button
            className="cancel-btn"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "15px",
            }}
            onClick={changeProfile}
          >
            {" "}
            Cancel{" "}
          </button>
        </div>
      </div>
    </div>
  );
}
