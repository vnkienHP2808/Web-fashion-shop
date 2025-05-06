import React, { useEffect, useState } from "react";
import axios from "axios";
import Paginated from "../../ui/Pagination";
const UserManagement = () => {
    const [users, setUsers] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [usersPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        const params = {
            page: currentPage,
            size: usersPerPage,
            ...(searchTerm.length > 0 && {name: searchTerm})
        };

        axios.get(`http://localhost:8080/api/users`, {params}).then((res) => {
            setUsers(res.data.content);
            setTotalPages(res.data.totalPages);
            setTotalElements(res.data.totalElements || 0);
        })
        .catch((err) => console.error("Error fetching users:", err));
    }, [currentPage, searchTerm]);

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

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div style={{ padding: "20px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                Quản Lý Người Dùng: <i style={{fontWeight: "normal"}}>{totalElements} người dùng</i>
            </h2>
            <input
                placeholder="Tìm kiếm tên người dùng"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginRight: "50px", width: "auto"}}
            />

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginBottom: "20px",
                }}
            >
                <thead>
                    <tr style={{ backgroundColor: "#f2f2f2" }}>
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
                                {user.name}
                            </td>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                {user.email}
                            </td>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                {Array.isArray(user.phones)
                                    ? user.phones.map((phone, index) => (
                                        <div key={index}>{index + 1}- {phone}</div>
                                    ))
                                    : user.phones}
                            </td>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                {Array.isArray(user.addresses)
                                    ? user.addresses.map((address, index) => (
                                        <div key={index}> {index + 1}- {address}.</div>
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
            <div className="d-flex justify-content-center" style={{ marginTop: "20px" }}>
                <Paginated totalPages={totalPages} currentPage={currentPage} handlePageChange={handlePageChange} />
            </div>
        </div>
    );
};

export default UserManagement;
