import React, { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import "./Verify.css";

const Verify = () => {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { url, token } = useContext(StoreContext);

  const [status, setStatus] = useState("verifying");

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const sessionId = searchParams.get("session_id");

  useEffect(() => {

    const verifyPayment = async () => {

      if (!orderId || !sessionId) {
        setStatus("error");
        setTimeout(() => navigate("/cart"), 2000);
        return;
      }

      try {

        const response = await axios.post(
          `${url}/api/order/verify`,
          {
            success: success === "true",
            orderId,
            session_id: sessionId
          },
          {
            headers: { token }
          }
        );

        if (response.data.success) {
          setStatus("success");
          setTimeout(() => navigate("/myorders"), 2000);
        } else {
          setStatus("failed");
          setTimeout(() => navigate("/cart"), 2000);
        }

      } catch (error) {

        console.error("Payment verification failed:", error);
        setStatus("error");
        setTimeout(() => navigate("/cart"), 2000);

      }

    };

    verifyPayment();

  }, [orderId, sessionId]);

  const getStatusMessage = () => {

    switch(status){
      case "verifying":
        return "Verifying your payment...";
      case "success":
        return "Payment successful! Redirecting...";
      case "failed":
        return "Payment failed. Returning to cart...";
      case "error":
        return "Verification failed. Returning to cart...";
      default:
        return "Processing...";
    }

  };

  return (
    <div className="verify">
      <div className={`spinner ${status}`}></div>
      <p>{getStatusMessage()}</p>
      <small>Order ID: {orderId ? orderId.slice(-6) : "N/A"}</small>
    </div>
  );
};

export default Verify;
