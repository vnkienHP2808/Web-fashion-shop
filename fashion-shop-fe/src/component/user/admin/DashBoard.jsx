import React, { useState } from "react";
import { Nav, Tab } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ProductManagement from "./ProductManagement";
import OrderManagement from "./OrderManagement";
import UserManagement from "./UserManagement";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";

const AdminDashboard = () => {
  const [key, setKey] = useState("products");
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">
      <Header></Header>
      <h2 className="text-center" style={{ marginTop: "50px" }}>
        Admin Dashboard
      </h2>
      <Tab.Container activeKey={key} onSelect={(k) => setKey(k)}>
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link eventKey="products" onClick={() => setKey("products")} 
                style = {{fontSize: key === "products" ? "20px" : "16px", fontWeight: key === "products" ? "bold" : "normal" }}
            >
              Manage Products
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="users" onClick={() => setKey("users")}
                style={{ fontSize: key === "users" ? "20px" : "16px", fontWeight: key === "users" ? "bold" : "normal" }}
            >
              Manage Users
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="orders" onClick={() => setKey("orders")}
                style={{ fontSize: key === "orders" ? "20px" : "16px", fontWeight: key === "orders" ? "bold" : "normal" }}
            >
              Manage Orders
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="products">
            <ProductManagement />
          </Tab.Pane>
          <Tab.Pane eventKey="users">
            <UserManagement />
          </Tab.Pane>
          <Tab.Pane eventKey="orders">
            <OrderManagement />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
      <Footer></Footer>
    </div>
  );
};

export default AdminDashboard;
