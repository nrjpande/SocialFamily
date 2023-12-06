import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/signup.css";
import { toast } from "react-toastify";
import fetch from 'node-fetch';

export default function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const notify = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const emailRegex = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%&])(?=.{8,})/;

  const userNameRegex = /\s/;
  const genderRadios = document.getElementsByName("gender");
  //to access rodio buttons
  genderRadios.forEach((radio) => {
    radio.addEventListener("change", (event) => {
      if (event.target.checked) {
        setGender(event.target.value);
      }
    });
  });
  //check the format of email, password and userName and check if all necessary details are filled then sign in
  const postData = () => {
    //checking email

    if (!emailRegex.test(email)) {
      return notify("Email format is incorrect");
    }
    if (!passwordRegex.test(password)) {
      return notify(
        "A password must contain 8 characters, 1 special character, lowercase, uppercase"
      );
    }
    if (userNameRegex.test(userName)) {
      return notify(userName + "A userName must not contain any space");
    }

    if (password !== confirmPassword) {
      return notify("Password and confirm password do not match!");
    }
    
    // sending data to server
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        userName: userName,
        password: password,
        gender: gender,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          notify(data.error);
        } else {
          notifyB(data.message);
          navigate("/SignIn");
        }
        console.log(data);
      });
  };

  return (
    <div className="signUp">
      <div className="form-container">
        <div className="form">
          <h1 className="SignUpTitle">SocialFamily</h1>

          <div id="emailAddress">
            <h7>Full Name</h7>
            <input
              type="text"
              name="ame"
              id="name"
              placeholder="Full Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            ></input>
          </div>
          <div id="emailAddress">
            <h7>User Name</h7>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            ></input>
          </div>
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
            ></input>
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
            ></input>
            <span
              id="showPassword"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
          <div className="enterPassword">
            <h7>Confirm Password</h7>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            ></input>
            <span
              id="showPassword"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
          <div class="radio-container">
            <label for="radio1">Male:</label>
            <input type="radio" id="radio1" name="gender" value="Male" />

            <label for="radio2">Female:</label>
            <input type="radio" id="radio2" name="gender" value="Female" />

            <label for="radio3">Other:</label>
            <input type="radio" id="radio3" name="gender" value="Other" />
          </div>
          <input
            type="submit"
            id="submit-btn"
            value="Register"
            onClick={() => {
              postData();
            }}
          ></input>
          <div className="bottom">
            Already have an account?
            <Link to="/SignIn">
              <span
                style={{
                  color: "red",
                  cursor: "pointer",
                  fontSize: "smaller",
                  left: "10px",
                }}
              >
                {" "}
                Login Now
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
