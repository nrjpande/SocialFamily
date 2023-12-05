import "./App.css";
import Navbar from "./components/NavBar";
import Home from "./screens/Home";
import SignUp from "./components/SignUp";
import Signin from "./components/SignIn";
import Profile from "./screens/Profile";
import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Createpost from "./screens/Createpost";
import React, { useState } from "react";
import { LoginContext } from "./context/loginContext";
import Modal from "./components/modal";
import UserProfile from "./components/UserProfile";
import MyFollowingPost from "./screens/MyFollowingPost";
import Notifications from "./components/notifications";

function App() {
  const [userLogin, setUserLogin] = useState(false);
  const [modalOpen, setmodalOpen] = useState(false);
  const jwtToken = localStorage.getItem("jwt");

  return (
    <BrowserRouter>
      <div className="App">
        <LoginContext.Provider value={{ setUserLogin, setmodalOpen }}>
          <Navbar login={userLogin} />
          <Routes>
            {jwtToken && (
              <>
                <Route path="/" element={<Home />} />
                <Route exact path="/Profile" element={<Profile />} />
                <Route path="/createPost" element={<Createpost />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/profile/:userid" element={<UserProfile />} />
                <Route path="/myfollowingpost" element={<MyFollowingPost />} />
              </>
            )}
            <Route
              path="/"
              element={
                jwtToken ? <Navigate to="/" /> : <Navigate to="/SignIn" />
              }
            />
            <Route path="/SignIn" element={<Signin />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route
              path="*"
              element={
                <div>
                  <h1> 404 Page not found</h1>
                </div>
              }
            />
          </Routes>
          <ToastContainer theme="dark" />
        </LoginContext.Provider>
        {modalOpen && <Modal setmodalOpen={setmodalOpen} />}
      </div>
    </BrowserRouter>
  );
}
export default App;
