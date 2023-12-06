import React, { useEffect, useState } from "react";
import "../css/profile.css";
import PostDetails from "../components/PostDetails.js";
import ProfilePic from "../components/ProfilePic.js";
import { toast } from "react-toastify";
import fetch from 'node-fetch';

export default function Profile() {
  const [pic, setPic] = useState([]);
  const [show, setShow] = useState(false);
  const [user, setUser] = useState("");
  const [posts, setPosts] = useState([]);
  const [changePic, setChangePic] = useState(false);
  const [postShow, setPostShow] = useState(true);
  const [savedShow, setSavedShow] = useState(false);
  const [savedPosts, setSavedPosts] = useState([]);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [nameValue, setNameValue] = useState(user.name);
  const [addressValue, setAddressValue] = useState(user.address);
  const [mobileValue, setMobileValue] = useState(user.mobile);
  const [bioValue, setBioValue] = useState(user.bio);
  const [genderValue, setGenderValue] = useState(user.gender);
  const [websiteValue, setWebsiteValue] = useState(user.website);

  const notifyB = (msg) => toast.success(msg);

  const defaultProfilePicture =
    "https://upload.wikimedia.org/wikipedia/commons/5/50/User_icon-cp.svg";

  //function to show/No-show PostDetails
  const toggleDetails = (posts) => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
      setPosts(posts);
    }
  };

  //function to change profile pic
  const changeProfile = () => {
    if (changePic) {
      setChangePic(false);
    } else {
      setChangePic(true);
    }
  };
  //function to fetch complete details of user, and user's post
  useEffect(() => {
    fetch(
      `/user/${
        JSON.parse(localStorage.getItem("user"))._id
      }`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      }
    )
      .then((res) => res.json())
      .then((result) => {
        setPic(result.post);
        setUser(result.user);
        setSavedPosts(result.savedPost);
        setNameValue(result.user.name);
        setAddressValue(result.user.address);
        setMobileValue(result.user.mobile);
        setWebsiteValue(result.user.website);
        setBioValue(result.user.bio);
        setGenderValue(result.user.gender);
      })
      .catch((error) => console.log(error));
  }, []);
  //update profile details of the user except email, password and userName
  const updateProfile = () => {
    fetch("/uploadProfileInfo", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        name: nameValue,
        mobile: mobileValue,
        address: addressValue,
        website: websiteValue,
        bio: bioValue,
        gender: genderValue,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        notifyB("Profile Updated Successfully!");
        window.location.reload();
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="profile">
      {/* profile frame */}
      <div className="profile-frame">
        {/* profile pic */}
        <div className="profile-pic">
          <img
            onClick={() => changeProfile()}
            src={user.photo ? user.photo : defaultProfilePicture}
            alt="profile pic"
          />
        </div>
        {/* profile data */}
        <div className="profile-data">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1 className="nameInProfile" style={{ fontWeight: "lighter" }}>
              {JSON.parse(localStorage.getItem("user")).userName}
            </h1>
            <button
              id="edit-profile-btn"
              onClick={() => setShowEditProfile(true)}
            >
              Edit Profile
            </button>
          </div>
          <div
            className="profile-info"
            style={{ display: "flex", fontSize: "12px", marginBottom: "2px" }}
          >
            <p> {pic ? pic.length : 0} posts </p>
            <p style={{ marginLeft: "20px" }}>
              {user.followers ? user.followers.length : 0} followers
            </p>
            <p style={{ marginLeft: "20px" }}>
              {user.following ? user.following.length : 0} following
            </p>
          </div>
          <div style={{ marginTop: "2px", fontSize: "12px" }}>
            {user.address !== "" && (
              <h4 style={{ fontWeight: "lighter" }}>
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "18px" }}
                >
                  location_on
                </span>
                {user.address}
              </h4>
            )}
            <h4 style={{ color: "rgb(57, 100, 132)" }}>{user.website}</h4>
            <h5 style={{ fontWeight: "lighter" }}>{user.bio}</h5>
          </div>
        </div>
      </div>
      <hr style={{ width: "90%", margin: " auto", opacity: "0.8" }} />
      <div>
        <button
          id="postButtons"
          onClick={() => {
            setPostShow(true);
            setSavedShow(false);
          }}
        >
          POSTS
        </button>
        <button
          id="postButtons"
          onClick={() => {
            setPostShow(false);
            setSavedShow(true);
          }}
        >
          SAVED
        </button>
      </div>
      <hr style={{ width: "90%", margin: " auto", opacity: "0.8" }} />

      {showEditProfile && (
        <div className="edit-profile-option">
          <div className="edit-profile-container" style={{ display: "block" }}>
            <div
              className="profile-pic"
              style={{ marginTop: "50px", lineHeight: "1px" }}
            >
              <img
                onClick={() => changeProfile()}
                src={user.photo ? user.photo : defaultProfilePicture}
                alt="profile pic"
              />
              <div
                style={{ textAlign: "left", margin: "10px", color: "darkgrey" }}
              >
                <p>Full Name</p>
                <input
                  type="text"
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  maxLength="25"
                  style={{
                    width: "97%",
                    height: "30px",
                    border: "1px solid lightGrey",
                    borderRadius: "3px",
                  }}
                />
                <p>Mobile</p>
                <input
                  type="text"
                  value={mobileValue}
                  onChange={(e) => setMobileValue(e.target.value)}
                  style={{
                    width: "97%",
                    height: "30px",
                    border: "1px solid lightGrey",
                    borderRadius: "3px",
                  }}
                />
                <p>Address</p>
                <input
                  type="text"
                  value={addressValue}
                  onChange={(e) => setAddressValue(e.target.value)}
                  style={{
                    width: "97%",
                    height: "30px",
                    border: "1px solid lightGrey",
                    borderRadius: "3px",
                  }}
                />
                <p>Website</p>
                <input
                  type="text"
                  value={websiteValue}
                  onChange={(e) => setWebsiteValue(e.target.value)}
                  style={{
                    width: "97%",
                    height: "30px",
                    border: "1px solid lightGrey",
                    borderRadius: "3px",
                  }}
                />
                <p>Bio</p>
                <textarea
                  type="text"
                  value={bioValue}
                  onChange={(e) => setBioValue(e.target.value)}
                  maxLength="200"
                  style={{
                    width: "97%",
                    height: "100px",
                    border: "1px solid lightGrey",
                    borderRadius: "3px",
                  }}
                />
                <p style={{ marginTop: "30px" }}>Gender</p>
                <select
                  value={genderValue}
                  onChange={(e) => setGenderValue(e.target.value)}
                  style={{
                    width: "100%",
                    height: "30px",
                    border: "1px solid lightGrey",
                    borderRadius: "3px",
                  }}
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
                <button
                  id="submit-btn"
                  type="submit"
                  style={{ width: "100%", marginTop: "15px" }}
                  onClick={() => {
                    updateProfile();
                    setShowEditProfile(false);
                  }}
                >
                  SAVE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showEditProfile && (
        <div className="close-edit-profile">
          <span
            className="material-symbols-outlined material-symbols-outlined-profile"
            onClick={() => setShowEditProfile(false)}
          >
            close
          </span>
        </div>
      )}

      {postShow && (
        <div className="gallery">
          {pic.map((pics) => {
            console.log(pics);
            return (
              <img
                key={pics._id}
                src={pics.photo}
                className="item"
                onClick={() => toggleDetails(pics)}
                alt={pics.body ? pics.body : "saved posts"}
              />
            );
          })}
        </div>
      )}
      {savedShow && (
        <div className="gallery">
          {savedPosts.map((pics) => {
            console.log(pics);
            return (
              <img
                key={pics._id}
                src={pics.photo}
                className="item"
                onClick={() => toggleDetails(pics)}
                alt={pics.body ? pics.body : "saved posts"}
              />
            );
          })}
        </div>
      )}
      {show && <PostDetails item={posts} toggleDetails={toggleDetails} />}
      {changePic && <ProfilePic changeProfile={changeProfile} />}
    </div>
  );
}
