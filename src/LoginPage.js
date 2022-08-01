import ltLogo from "./img/LaneTerraleverSquaresLogo.png";
import "./LoginPage.css";
import { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

function LoginPage() {
  const [username_input, set_username_input] = useState("");
  const [password_input, set_password_input] = useState("");
  const [incorrect_warning, set_incorrect_warning] = useState("");
  const [cookies, setCookie] = useCookies(["user"]);

  function handleCookie(username) {
    if (cookies.user !== null) {
      setCookie("user", username, {
        path: "/",
      });
    } else {
      console.log("Cookie already set");
    }
  }

  const login_check = () => {
    Axios.post("http://localhost:3001/login-info/get", {
      username_input: username_input,
      password_input: password_input,
    }).then((response) => {
      if (response.data.length === 0) {
        wrong_input();
      } else {
        login_success();
        handleCookie(response.data[0].Username);
      }
    });
  };

  function wrong_input() {
    set_incorrect_warning(
      <>
        <p className="red-text">Incorrect Username or Password</p>
      </>
    );
    document.getElementById("username_field").style.border = "1.5px solid red";
    document.getElementById("password_field").style.border = "1.5px solid red";
  }

  let navigate = useNavigate();
  function login_success() {
    set_incorrect_warning(<></>);
    set_username_input("");
    set_password_input("");
    navigate(
      "/admin-page/6b66fb29e40b7bb2513aab8ef3132f3a7e1e7a0ba16fce846044139dff29a0087a5044fb31bb095b1fedcb37e4d84cced6046c6b5c3b4ac79d94530ee32c0f6ddd705d4e7f4e584d26c74ad144f0669de3127fd56f20ae8679252a225e0aa6f6c183d97e8548467a0d3e43a459e7021c9bfe732cbbe003e67bdfbb67f578eb945db32665e9237fb36730daf0174c3810f118e02d5495135be37735da1fb6b6dc"
    );
  }
  return (
    <div className="login-screen">
      <h2>Web Maintenance Form Admin Page</h2>
      <img src={ltLogo} className="lt-img" alt="LaneTerralever Logo" />
      {incorrect_warning}
      <input
        type="text"
        placeholder="Username"
        value={username_input}
        id="username_field"
        onChange={(e) => {
          set_username_input(e.target.value); //Set real-time value of link_text
        }}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            login_check();
          }
        }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password_input}
        id="password_field"
        onChange={(e) => {
          set_password_input(e.target.value); //Set real-time value of link_text
        }}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            login_check();
          }
        }}
      />
      <button onClick={login_check}>Login</button>
    </div>
  );
}

export default LoginPage;
