import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "50px",
        color: "#333",
      }}
    >
      <h1
        style={{
          fontSize: "6em",
          color: "#e74c3c",
        }}
      >
        404
      </h1>

      <p
        style={{
          fontSize: "1.5em",
        }}
      >
        Oops! Bạn không được truy cập trang này.
      </p>

      <Link
        to="/"
        style={{
          textDecoration: "none",
          color: "#3498db",
          fontWeight: "bold",
          fontSize: "1.2em",
        }}
      >
        Quay lại trang chủ
      </Link>
    </div>
  );
};

export default NotFound;
