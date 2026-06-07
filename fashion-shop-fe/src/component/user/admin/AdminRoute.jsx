import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const loggedInUser = JSON.parse(localStorage.getItem("account"));
  if (!loggedInUser || loggedInUser.role !== "Admin") {
    return <Navigate to="/404" />;
  }
  return children;
};

export default AdminRoute;
