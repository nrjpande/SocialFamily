import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/navbar.css";
import { LoginContext } from "../context/loginContext";

export default function Navbar({ login }) {
  const { setmodalOpen } = useContext(LoginContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationCount, setShowNotificationCount] = useState(false);

  const defaultProfilePicture =
    "https://upload.wikimedia.org/wikipedia/commons/5/50/User_icon-cp.svg";

  const [dropdownVisible, setDropdownVisible] = useState(false);

  //set if user wants to show dropdown
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };
  //set if user do not want to show dropdown
  const closeDropdown = () => {
    setDropdownVisible(false);
  };
  //change createdAt time into required format
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
  //function to delete all the notifications in one go
  const deleteNotifications = () => {
    fetch("/deletenotifications", {
      method: "put",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setNotificationOpen(false);
      })
      .catch((err) => console.log(err));
  };

  // if notification arrives it should be visible to the user on real time

  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      fetch("/allnotifications", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.length > 0) {
            setShowNotificationCount(true);
          }
          setNotifications(result);
        })
        .catch((err) => console.log(err));
    }
  }, [notifications]);

  // navigation large screen devices
  const loginStatus = () => {
    const token = localStorage.getItem("jwt");
    if (login || token) {
      return [
        <>
          <div className="navbar-container">
            <div>
              <img
                src="http://res.cloudinary.com/cloudofneeraj/image/upload/v1701196361/qqrc2cv1kbz92vidnlh3.png"
                alt="familySocial logo"
                id="Social-family-logo"
              />
            </div>
            <div className="search-bar">
              <input
                type="text"
                placeholder=" Enter to search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <ul>
                <Link to="/">
                  <li>
                    <span
                      style={{ fontSize: "36px" }}
                      className="material-symbols-outlined"
                    >
                      home
                    </span>
                  </li>
                </Link>
                <Link>
                  <li
                    onClick={() =>
                      alert(
                        "We are sorry, we are working on this feature, stay tuned"
                      )
                    }
                  >
                    <span style={{ fontSize: "36px" }} class="material-icons">
                      chat
                    </span>
                  </li>
                </Link>
                <Link>
                  <li>
                    <span
                      style={{ fontSize: "36px" }}
                      onClick={() => setNotificationOpen(!notificationOpen)}
                      class="material-icons"
                    >
                      notifications
                    </span>
                  </li>
                </Link>
                {showNotificationCount && (
                  <div className="notificationCount">
                    {notifications.length}
                  </div>
                )}
                <Link>
                  <li
                    className="dropdown-btn"
                    onClick={toggleDropdown}
                    onBlur={closeDropdown}
                  >
                    <img
                      id="profileImage"
                      src={
                        JSON.parse(localStorage.getItem("user")).photo
                          ? JSON.parse(localStorage.getItem("user")).photo
                          : defaultProfilePicture
                      }
                      alt="profilePic"
                      onError={(e) => {
                        e.target.src = defaultProfilePicture;
                      }}
                    />
                    {dropdownVisible && (
                      <div className="dropdown-content">
                        <Link className="dropdownLinks" to="/Profile">
                          Profile
                        </Link>
                        <Link
                          className="dropdownLinks"
                          onClick={() => setmodalOpen(true)}
                        >
                          Logout
                        </Link>
                      </div>
                    )}
                  </li>
                </Link>
                {notificationOpen && (
                  <div className="notification-dropdown-content">
                    <div className="notification-icon">
                      <span
                        style={{
                          color: "black",
                          fontWeight: "bolder",
                          fontSize: "30px",
                        }}
                      >
                        Notification
                      </span>
                      <span class="material-icons" style={{ color: "red" }}>
                        notifications
                      </span>
                    </div>
                    {notifications.map((notification) => {
                      let notificationText = ""; // Initialize notificationText

                      if (notification.type === "followed") {
                        notificationText = ", has started to follow you";
                      } else if (notification.type === "posted") {
                        notificationText = ", has posted something";
                      } else if (notification.type === "liked") {
                        notificationText = ", has liked your post";
                      } else if (notification.type === "commented") {
                        notificationText = ", has commented on your post";
                      }
                      return (
                        <div key={notification._id}>
                          <div style={{ color: "black", display: "flex" }}>
                            <img
                              id="profileImageNotification"
                              src={notification.sender.photo}
                              alt=""
                            />
                            <p style={{ color: "black", fontWeight: "bolder" }}>
                              {notification.sender.userName}
                            </p>

                            <p style={{ color: "black" }}>{notificationText}</p>
                          </div>
                          <div
                            style={{
                              color: "black",
                              display: "flex",
                              justifyContent: "space-between",
                              marginRight: "10px",
                            }}
                          >
                            <span style={{ alignItems: "center" }}>
                              {formatTimeDifference(notification.createdAt)}
                            </span>
                            <span class="material-symbols-outlined material-symbols-outlined-time">
                              adjust
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    {notifications.length >= 1 && (
                      <div className="delete-notifications">
                        <button onClick={deleteNotifications}>
                          Delete All
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </ul>
            </div>
          </div>
        </>,
      ];
    }
  };
  //navigation for small screen devices
  const loginStatusMobile = () => {
    const token = localStorage.getItem("jwt");
    if (login || token) {
      return [
        <>
          <Link to="/">
            <li>
              <span className="material-symbols-outlined">home</span>
            </li>
          </Link>
          <div>
            <Link to="/notifications">
              <li>
                <span class="material-icons">notifications</span>
              </li>
            </Link>
          </div>
          <Link to="/createPost">
            <li>
              <span className="material-symbols-outlined">add_box</span>
            </li>
          </Link>
          <Link to="/Profile">
            <li>
              <span className="material-symbols-outlined">account_circle</span>
            </li>
          </Link>
          <Link to={""}>
            <li onClick={() => setmodalOpen(true)}>
              <span className="material-symbols-outlined">logout</span>
            </li>
          </Link>
        </>,
      ];
    }
  };
  return (
    <div className="navbar">
      <div className="nav-menu">{loginStatus()}</div>
      <ul className="nav-mobile">{loginStatusMobile()}</ul>
    </div>
  );
}
