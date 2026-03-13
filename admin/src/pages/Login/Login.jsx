import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ url, setToken }) => {
    const [currState, setCurrState] = useState("Admin Login");
    const [showPassword, setShowPassword] = useState(false);
    const [data, setData] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    const onLogin = async (event) => {
        event.preventDefault();
        
        if (data.email !== "foodiesofficial82@gmail.com") {
            alert("Access Denied: Unrecognized Admin Email");
            return;
        }

        try {
            const response = await axios.post(`${url}/api/user/admin-login`, data);
            
            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                navigate('/add'); 
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            alert("Login failed. Please check if your backend server is running.");
        }
    };

    const onForgotPassword = async (e) => {
        e.preventDefault();
        if (!data.email) {
            alert("Please enter your email address first.");
            return;
        }
        try {
            const response = await axios.post(`${url}/api/user/forgot-password`, { email: data.email });
            if (response.data.success) {
                alert(response.data.message);
                setCurrState("Admin Login"); 
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            alert("Error sending reset link.");
        }
    };

    return (
        <div className='login-page'>
            <form onSubmit={currState === "Admin Login" ? onLogin : onForgotPassword} className="login-container">
                <h2>{currState}</h2>
                <div className="login-inputs">
                    <input 
                        name='email' 
                        onChange={onChangeHandler} 
                        value={data.email} 
                        type="email" 
                        placeholder='Admin Email' 
                        required 
                    />
                    {currState === "Admin Login" && (
                        <div className="password-input-wrapper">
                            <input 
                                name='password' 
                                onChange={onChangeHandler} 
                                value={data.password} 
                                type={showPassword ? "text" : "password"} 
                                placeholder='Password' 
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
                <button type='submit'>
                    {currState === "Admin Login" ? "Login" : "Send Reset Link"}
                </button>
                <p className='toggle-link'>
                    {currState === "Admin Login" 
                        ? <>Forgot Password? <span onClick={() => setCurrState("Forgot Password")}>Click here</span></>
                        : <>Remember password? <span onClick={() => setCurrState("Admin Login")}>Login here</span></>
                    }
                </p>
            </form>
        </div>
    );
};

export default Login;