import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import fetch from 'node-fetch';

export default function Notifications() {
  //function to delete all the notifications in one go

  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
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

  const deleteNotifications = () => {
    fetch("/deletenotifications", {
      method: "put",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  // if notification arrives it should be visible to the user on real time
  useEffect(() => {
    fetch("/allnotifications", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setNotifications(result);
      })
      .catch((err) => console.log(err));
  }, [notifications]);

  return (
    <div>
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
            <button onClick={deleteNotifications}>Delete All</button>
          </div>
        )}
      </div>
    </div>
  );
}
