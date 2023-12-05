import React from "react";
import { RiCloseLine } from "react-icons/ri";
import "../css/modal.css";
import { useNavigate } from "react-router-dom";


//to open dialog boxes to logout or upload profile pics
export default function Modal({ setmodalOpen }) {
  const navigate = useNavigate();
  return (
    <div className="darkBg" onClick={() => setmodalOpen(false)}>
      <div className="centered">
        <div className="modal">
          {/* modal header */}
          <div className="modalHeader">
            <h5 className="heading">Confirm</h5>
          </div>
          <button className="closeBtn" onClick={() => setmodalOpen(false)}>
            <RiCloseLine></RiCloseLine>
          </button>
          {/* modal content */}
          <div className="modalContent">Do you really want to Logout?</div>
          <div className="modalActions">
            <div className="actionsContainer">
              <button
                className="logOutBtn"
                onClick={() => {
                  setmodalOpen(false);
                  localStorage.clear();
                  navigate("./SignIn");
                  window.location.reload();
                }}
              >
                Log Out
              </button>
              <button className="cancelBtn" onClick={() => setmodalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
