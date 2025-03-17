import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const loggedInUser = JSON.parse(sessionStorage.getItem("account"));
  if (!loggedInUser || loggedInUser.role !== "admin") {
    return <Navigate to="/404" />;
  }
  return children;
};

export default AdminRoute;
