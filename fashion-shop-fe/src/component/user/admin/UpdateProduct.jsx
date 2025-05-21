import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Form } from "react-bootstrap";

const UpdateProduct = () => {
    const { id } = useParams();
    const [categories, setCategories] = useState([]);
    const [editProduct, setEditProduct] = useState({
        idProduct: id,
        name_product: "",
        idCat: "",
        idSubcat: "",
        price: 0,
        sale_price: 0,
        is_sale: false,
        is_new: false,
        occasion: "",
        images: [],
        sold_quantity: 0,
        in_stock: 0,
        status: "Active",
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]); // ảnh cần xóa
    const nav = useNavigate();

    useEffect(() => {
        const auth = sessionStorage.getItem("auth");
        if (auth) {
            const interceptor = axios.interceptors.request.use((config) => {
                config.headers.Authorization = `Basic ${auth}`;
                return config;
            });
            return () => axios.interceptors.request.eject(interceptor);
        }
    }, []);

    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/products/${id}`)
            .then((res) => setEditProduct(res.data))
            .catch((err) => console.error("Lỗi khi lấy sản phẩm:", err));

        axios
            .get("http://localhost:8080/api/categories")
            .then((res) => setCategories(res.data))
            .catch((err) => console.error("Lỗi khi lấy danh mục:", err));
    }, [id]);


    useEffect(() => {
        setEditProduct((prev) => ({ ...prev, idSubcat: "" }));
    }, [editProduct.idCat]);

    const handleUpdate = (e) => {
        e.preventDefault();

        const formData = new FormData();
        // Gửi cả ảnh hiện tại và ảnh mới (trừ ảnh cần xóa)
        const updatedImages = editProduct.images.filter(
            (img) => !imagesToDelete.includes(img.imageLink)
        );
        formData.append("product", JSON.stringify({ ...editProduct, images: updatedImages }));
        selectedFiles.forEach((file) => {
            formData.append("images", file);
        });

        axios
            .put(`http://localhost:8080/api/products/${id}`, formData)
            .then(() => {
                alert("Cập nhật thành công!");
                nav("/admin");
            })
            .catch((err) => {
                console.error("Cập nhật thất bại:", err);
                alert("Cập nhật thất bại. Vui lòng thử lại.");
            });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles([...selectedFiles, ...files]);
    };

    const removeSelectedFile = (index) => {
        const updatedFiles = [...selectedFiles];
        updatedFiles.splice(index, 1);
        setSelectedFiles(updatedFiles);
    };

    const removeExistingImage = (index) => {
        const updatedImages = [...editProduct.images];
        const imageToDelete = updatedImages.splice(index, 1)[0].imageLink;
        setEditProduct({ ...editProduct, images: updatedImages });
        setImagesToDelete([...imagesToDelete, imageToDelete]);
    };

    const selectedCategory = categories.find(
        (cat) => cat.id === Number(editProduct.idCat)
    );

    return (
        <div className="update-product container">
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                Cập nhật sản phẩm {id}
            </h2>
            <Form onSubmit={handleUpdate}>
                <Form.Group controlId="formProductId">
                    <Form.Label>ID</Form.Label>
                    <Form.Control
                        type="text"
                        value={editProduct.idProduct}
                        readOnly
                        disabled
                    />
                </Form.Group>

                <Form.Group controlId="formProductName">
                    <Form.Label>Tên</Form.Label>
                    <Form.Control
                        type="text"
                        value={editProduct.name_product}
                        onChange={(e) =>
                            setEditProduct({
                                ...editProduct,
                                name_product: e.target.value,
                            })
                        }
                    />
                </Form.Group>

                <Form.Group controlId="formProductCategory">
                    <Form.Label>Danh mục</Form.Label>
                    <Form.Control
                        as="select"
                        value={editProduct.idCat}
                        onChange={(e) =>
                            setEditProduct({
                                ...editProduct,
                                idCat: e.target.value,
                            })
                        }
                    >
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="formProductSubcategory">
                    <Form.Label>Phân loại</Form.Label>
                    <Form.Control
                        as="select"
                        value={editProduct.idSubcat}
                        onChange={(e) =>
                            setEditProduct({
                                ...editProduct,
                                idSubcat: e.target.value,
                            })
                        }
                        disabled={!selectedCategory?.subCategories?.length}
                    >
                        {selectedCategory?.subCategories?.map((sub) => (
                            <option key={sub.id_subcat} value={sub.id_subcat}>
                                {sub.name}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="formProductPrice">
                    <Form.Label>Giá</Form.Label>
                    <Form.Control
                        type="number"
                        value={editProduct.price}
                        onChange={(e) => {
                            const ip = parseInt(e.target.value, 10);
                            setEditProduct({
                                ...editProduct,
                                price: ip >= 0 ? ip : 0,
                            });
                        }}
                    />
                </Form.Group>

                <Form.Group controlId="formProductSalePrice">
                    <Form.Label>Giá khuyến mãi</Form.Label>
                    <Form.Control
                        type="number"
                        value={editProduct.sale_price || ""}
                        onChange={(e) => {
                            const ip = parseInt(e.target.value, 10);
                            setEditProduct({
                                ...editProduct,
                                sale_price: ip >= 0 ? ip : 0,
                            });
                        }}
                    />
                </Form.Group>

                <Form.Group controlId="formIsSale">
                    <Form.Label>Đang giảm giá</Form.Label>
                    <Form.Check
                        type="checkbox"
                        label="Đánh dấu là sản phẩm đang giảm giá"
                        checked={editProduct.is_sale}
                        onChange={(e) =>
                            setEditProduct({
                                ...editProduct,
                                is_sale: e.target.checked,
                            })
                        }
                    />
                </Form.Group>

                <Form.Group controlId="formIsNew">
                    <Form.Label>Hàng mới</Form.Label>
                    <Form.Check
                        type="checkbox"
                        label="Đánh dấu là sản phẩm mới"
                        checked={editProduct.is_new}
                        onChange={(e) =>
                            setEditProduct({
                                ...editProduct,
                                is_new: e.target.checked,
                            })
                        }
                    />
                </Form.Group>

                <Form.Group controlId="formProductOccasion">
                    <Form.Label>Dịp sử dụng</Form.Label>
                    <Form.Control
                        as="select"
                        value={editProduct.occasion}
                        onChange={(e) =>
                            setEditProduct({
                                ...editProduct,
                                occasion: e.target.value,
                            })
                        }
                    >
                        <option value="Đi chơi">Đi chơi</option>
                        <option value="Đi làm">Đi làm</option>
                        <option value="Đi tiệc">Đi tiệc</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="formProductImages">
                    <Form.Label>Ảnh hiện tại</Form.Label>
                    {editProduct.images && editProduct.images.length > 0 ? (
                        <ul className="list-group">
                            {editProduct.images.map((image, index) => (
                                <li
                                    key={index}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                >
                                    <span
                                        style={{
                                            maxWidth: "400px",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {image.imageLink}
                                    </span>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => removeExistingImage(index)}
                                    >
                                        Xóa
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Chưa có ảnh nào</p>
                    )}
                </Form.Group>

                <Form.Group controlId="formProductNewImages">
                    <Form.Label>Thêm ảnh mới</Form.Label>
                    <Form.Control
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    {selectedFiles.length > 0 && (
                        <div className="selected-files mt-2">
                            <p>Các file đã chọn:</p>
                            <ul className="list-group">
                                {selectedFiles.map((file, index) => (
                                    <li
                                        key={index}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                    >
                                        {file.name}
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => removeSelectedFile(index)}
                                        >
                                            Xóa
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Form.Group>

                <Form.Group controlId="formSoldQuantity">
                    <Form.Label>Đã bán</Form.Label>
                    <Form.Control
                        type="number"
                        value={editProduct.sold_quantity}
                        onChange={(e) => {
                            const ip = parseInt(e.target.value, 10);
                            setEditProduct({
                                ...editProduct,
                                sold_quantity: ip >= 0 ? ip : 0,
                            });
                        }}
                    />
                </Form.Group>

                <Form.Group controlId="formInStock">
                    <Form.Label>Trong kho</Form.Label>
                    <Form.Control
                        type="number"
                        value={editProduct.in_stock}
                        onChange={(e) => {
                            const ip = parseInt(e.target.value, 10);
                            setEditProduct({
                                ...editProduct,
                                in_stock: ip >= 0 ? ip : 0,
                            });
                        }}
                    />
                </Form.Group>

                <Form.Group controlId="formProductStatus">
                    <Form.Label>Trạng thái</Form.Label>
                    <Form.Control
                        as="select"
                        value={editProduct.status}
                        onChange={(e) =>
                            setEditProduct({ ...editProduct, status: e.target.value })
                        }
                    >
                        <option value="Active">Kích hoạt</option>
                        <option value="Deactivate">Hủy kích hoạt</option>
                    </Form.Control>
                </Form.Group>

                <Button variant="primary" type="submit" style={{ marginTop: "20px" }}>
                    Cập nhật
                </Button>
            </Form>
        </div>
    );
};

export default UpdateProduct;