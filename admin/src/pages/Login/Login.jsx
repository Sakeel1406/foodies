import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ url, setToken }) => {
    const [currState, setCurrState] = useState("Admin Login");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    const onLogin = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (data.email !== "foodiesofficial82@gmail.com") {
            alert("Access Denied: Unrecognized Admin Email");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                `${url}/api/user/admin-login`,
                { email: data.email, password: data.password },
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("Login response:", response.data); // ← debug

            if (response.data.success) {
                const token = response.data.token;
                setToken(token);
                localStorage.setItem("token", token);
                navigate('/add');
            } else {
                alert(response.data.message || "Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Login failed. Backend may be sleeping, try again in 30 seconds.");
        } finally {
            setLoading(false);
        }
    };

    const onForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!data.email) {
            alert("Please enter your email address first.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                `${url}/api/user/forgot-password`,
                { email: data.email }
            );

            if (response.data.success) {
                alert(response.data.message);
                setCurrState("Admin Login");
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            alert("Error sending reset link. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='login-page'>
            <form
                onSubmit={currState === "Admin Login" ? onLogin : onForgotPassword}
                className="login-container"
            >
                {/* Logo */}
                <div className="login-logo">
                    <h1> Foodies</h1>
                    <p>Admin Panel</p>
                </div>

                <h2>{currState}</h2>

                <div className="login-inputs">
                    {/* Email */}
                    <input
                        name='email'
                        onChange={onChangeHandler}
                        value={data.email}
                        type="email"
                        placeholder='Admin Email'
                        required
                        disabled={loading}
                    />

                    {/* Password */}
                    {currState === "Admin Login" && (
                        <div className="password-input-wrapper">
                            <input
                                name='password'
                                onChange={onChangeHandler}
                                value={data.password}
                                type={showPassword ? "text" : "password"}
                                placeholder='Password'
                                required
                                disabled={loading}
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

                {/* Submit Button */}
                <button type='submit' disabled={loading}>
                    {loading
                        ? "Please wait..."
                        : currState === "Admin Login"
                            ? "Login"
                            : "Send Reset Link"
                    }
                </button>

                {/* Toggle Link */}
                <p className='toggle-link'>
                    {currState === "Admin Login"
                        ? <>Forgot Password?{" "}
                            <span onClick={() => !loading && setCurrState("Forgot Password")}>
                                Click here
                            </span>
                          </>
                        : <>Remember password?{" "}
                            <span onClick={() => !loading && setCurrState("Admin Login")}>
                                Login here
                            </span>
                          </>
                    }
                </p>
            </form>
        </div>
    );
};

export default Login;