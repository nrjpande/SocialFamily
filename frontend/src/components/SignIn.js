import React, { useContext } from "react";
import "../css/signin.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { LoginContext } from "../context/loginContext";

export default function Signin() {
  const { setUserLogin } = useContext(LoginContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const notify = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const emailRegex = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/;

  //sign in function if no login tokens are saved
  const postData = () => {
    //checking email
    if (!emailRegex.test(email)) {
      return notify("Invalid email");
    }

    // sending data to server
    fetch("/SignIn", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          notify(data.error);
        } else {
          notifyB("Signed In Successfully");
          console.log("1  " + data);
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setUserLogin(true);
          navigate("/");
        }
        console.log(data);
      });
  };

  return (
    <div className="signIn">
      <div className="loginForm">
        <h1 className="signInTitle">SocialFamily</h1>
        <div id="emailAddress">
          <h7>Email Address</h7>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="enterPassword">
          <h7>Password</h7>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <span
            id="showPassword"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>
        <div>
          <input
            type="submit"
            id="login-btn"
            value="Login"
            onClick={() => postData()}
          />
        </div>
        <div className="bottom">
          Don't have an account?
          <Link to="/SignUp">
            <span
              style={{
                color: "red",
                cursor: "pointer",
                fontSize: "smaller",
                left: "10px",
              }}
            >
              {" "}
              Register Now{" "}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
