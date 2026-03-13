import React, { useContext, useEffect, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken, fetchUserData } = useContext(StoreContext);

  const [currState, setCurrState] = useState("Login");
  const [showPassword, setShowPassword] = useState(false);

  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  // Reset form when switching modes
  useEffect(() => {
    setData({ name: "", email: "", password: "" });
    setShowPassword(false);
  }, [currState]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();

    let endpoint = "";
    let payload = {};

    if (currState === "Login") {
      endpoint = "/api/user/login";
      payload = {
        email: data.email,
        password: data.password
      };
    }

    if (currState === "Sign-Up") {
      endpoint = "/api/user/register";
      payload = data;
    }

    if (currState === "Forgot Password") {
      endpoint = "/api/user/forgot-password";
      payload = { email: data.email };
    }

    try {
      const response = await axios.post(url + endpoint, payload);

      if (!response.data.success) {
        toast.error(response.data.message);
        return;
      }

      if (currState === "Forgot Password") {
        toast.success(response.data.message);
        setCurrState("Login");
        return;
      }

      // Login / Signup success
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);

      if (fetchUserData) {
        await fetchUserData(response.data.token);
      }

      setShowLogin(false);
      toast.success(
        currState === "Login" ? "Login Successful" : "Account Created"
      );
    } catch (error) {
      console.error(error);
      toast.error("Server connection failed");
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onFormSubmit} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            src={assets.cross_icon}
            alt="close"
            onClick={() => setShowLogin(false)}
          />
        </div>

        <div className="login-popup-inputs">
          {currState === "Sign-Up" && (
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={data.name}
              onChange={onChangeHandler}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={data.email}
            onChange={onChangeHandler}
            required
          />

          {currState !== "Forgot Password" && (
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={data.password}
                onChange={onChangeHandler}
                required
              />
              <span
                className="password-toggle-text"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </span>
            </div>
          )}
        </div>

        <button type="submit">
          {currState === "Sign-Up"
            ? "Create Account"
            : currState === "Login"
            ? "Login"
            : "Send Reset Email"}
        </button>

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>

        {currState === "Login" ? (
          <>
            <p>
              Create a new account?{" "}
              <span onClick={() => setCurrState("Sign-Up")}>Click here</span>
            </p>
            <p>
              Forgot Password?{" "}
              <span onClick={() => setCurrState("Forgot Password")}>
                Reset here
              </span>
            </p>
          </>
        ) : (
          <p>
            Back to login?{" "}
            <span onClick={() => setCurrState("Login")}>Click here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
