import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import Login from './pages/Login/Login';
import Add from './pages/Add/Add';
import List from './pages/List/List';
import Orders from './pages/Orders/Orders';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const App = () => {
  const url = "http://localhost:4000";
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  return (
    <div className="app">
      <ToastContainer />

      {!token ? (
        <Routes>
          <Route path="/login" element={<Login url={url} setToken={setToken} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <>
          <Navbar setToken={setToken} />
          <div className="app-content">
            <Sidebar />
            <div className="page-content">
              <Routes>
                <Route path="/add" element={<Add url={url} />} />
                <Route path="/list" element={<List url={url} />} />
                <Route path="/orders" element={<Orders url={url} />} />
                <Route path="*" element={<Navigate to="/add" />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
