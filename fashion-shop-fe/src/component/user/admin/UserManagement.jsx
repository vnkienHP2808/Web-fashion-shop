import React, { useEffect, useState } from "react";
import axios from "axios";

const UserManagement = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/users").then((res) => {
            setUsers(res.data);
        });
    }, []);

    const handleToggleUserStatus = (id) => {
        const updatedUser = users.find((user) => user.id_user === id);
        updatedUser.status =
            updatedUser.status === "Active" ? "Inactive" : "Active";

        if (updatedUser.role === "Admin" && updatedUser.status === "Inactive") {
            alert("Admin không thể tự hủy kích hoạt!");
            return;
        }

        axios
            .put(`http://localhost:8080/api/users/${id}/status`, { status: updatedUser.status })
            .then(() => {
                setUsers(users.map((user) => (user.id_user === id ? updatedUser : user)));
            });

    };

    return (
        <div style={{ padding: "20px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                Quản Lý Người Dùng
            </h2>
            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginBottom: "20px",
                }}
            >
                <thead>
                    <tr style={{ backgroundColor: "#f2f2f2" }}>
                        <th style={{ padding: "10px", border: "1px solid #ddd" }}>ID</th>
                        <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                            Tên người dùng
                        </th>
                        <th style={{ padding: "10px", border: "1px solid #ddd" }}>Email</th>
                        <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                            Số điện thoại
                        </th>
                        <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                            Địa chỉ
                        </th>
                        <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                            Vai trò
                        </th>
                        <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                            Trạng thái
                        </th>
                        <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                            Thao tác
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id_user}>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                {user.id_user}
                            </td>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                {user.name}
                            </td>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                {user.email}
                            </td>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                {Array.isArray(user.phones)
                                    ? user.phones.map((phone, index) => (
                                        <div key={index}>{index + 1}: {phone}</div>
                                    ))
                                    : user.phones}
                            </td>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                {Array.isArray(user.addresses)
                                    ? user.addresses.map((address, index) => (
                                        <div key={index}> {index + 1}: {address}.</div>
                                    ))
                                    : user.addresses}
                            </td>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                {user.role}
                            </td>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                {user.status}
                            </td>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                <button
                                    onClick={() => handleToggleUserStatus(user.id_user)}
                                    disabled={user.role === "Admin" && user.status === "Active"}
                                    style={{
                                        backgroundColor:
                                            user.status === "Active" ? "#f44336" : "#4CAF50",
                                        color: "white",
                                        padding: "5px 10px",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor:
                                            user.role === "Admin" && user.status === "Active"
                                                ? "not-allowed"
                                                : "pointer",
                                    }}
                                >
                                    {user.status === "Active" ? "Deactivate" : "Activate"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;
