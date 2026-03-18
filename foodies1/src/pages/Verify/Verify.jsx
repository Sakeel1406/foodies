import React, { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import "./Verify.css";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { url, token, setCartItems } = useContext(StoreContext);

  const [status, setStatus] = useState("verifying");
  const [countdown, setCountdown] = useState(3);

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const verifyPayment = async () => {
      // ✅ If no orderId or sessionId — error
      if (!orderId) {
        setStatus("error");
        startCountdown("/cart");
        return;
      }

      // ✅ If payment was cancelled
      if (success === "false") {
        await axios.post(
          `${url}/api/order/verify`,
          { success: false, orderId, session_id: sessionId || "" },
          { headers: { token } }
        );
        setStatus("failed");
        startCountdown("/cart");
        return;
      }

      // ✅ If no session_id
      if (!sessionId) {
        setStatus("error");
        startCountdown("/cart");
        return;
      }

      try {
        const response = await axios.post(
          `${url}/api/order/verify`,
          {
            success: true,
            orderId,
            session_id: sessionId,
          },
          { headers: { token } }
        );

        if (response.data.success) {
          // ✅ Clear cart on success
          setCartItems({});
          localStorage.removeItem("cartItems");
          setStatus("success");
          startCountdown("/myorders");
        } else {
          setStatus("failed");
          startCountdown("/cart");
        }
      } catch (error) {
        console.error("Payment verification failed:", error);
        setStatus("error");
        startCountdown("/cart");
      }
    };

    verifyPayment();
  }, [orderId, sessionId]);

  // ✅ Countdown before redirect
  const startCountdown = (path) => {
    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count === 0) {
        clearInterval(interval);
        navigate(path);
      }
    }, 1000);
  };

  const getStatusMessage = () => {
    switch (status) {
      case "verifying":
        return "Verifying your payment...";
      case "success":
        return "Payment successful!";
      case "failed":
        return "Payment failed.";
      case "error":
        return "Verification error.";
      default:
        return "Processing...";
    }
  };

  const getSubMessage = () => {
    switch (status) {
      case "verifying":
        return "Please wait, do not close this page.";
      case "success":
        return `Redirecting to your orders in ${countdown}s...`;
      case "failed":
        return `Returning to cart in ${countdown}s...`;
      case "error":
        return `Returning to cart in ${countdown}s...`;
      default:
        return "";
    }
  };

  return (
    <div className="verify">
      <div className="verify-card">

        {/* Icon */}
        <div className={`verify-icon ${status}`}>
          {status === "verifying" && <div className="spinner"></div>}
          {status === "success" && <span>✓</span>}
          {status === "failed" && <span>✗</span>}
          {status === "error" && <span>!</span>}
        </div>

        {/* Status message */}
        <h2 className={`verify-title ${status}`}>
          {getStatusMessage()}
        </h2>

        {/* Sub message */}
        <p className="verify-subtitle">
          {getSubMessage()}
        </p>

        {/* Order ID */}
        {orderId && (
          <p className="verify-orderid">
            Order ID: #{orderId.slice(-6).toUpperCase()}
          </p>
        )}

        {/* Manual redirect buttons */}
        {status !== "verifying" && (
          <div className="verify-buttons">
            {status === "success" ? (
              <button onClick={() => navigate("/myorders")}>
                View My Orders
              </button>
            ) : (
              <button onClick={() => navigate("/cart")}>
                Return to Cart
              </button>
            )}
            <button
              className="secondary"
              onClick={() => navigate("/")}
            >
              Go to Home
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Verify;