import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminRoute from "./AdminRoute";
import { Modal, Button, Form, Table } from "react-bootstrap";

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name_product: "",
        price: "",
        in_stock: 0,
        status: "Active",
        occasion: "",
        images: [],
        idCat: 1,
        idSubcat: 1,
        sale_price: null,
        is_sale: false,
        is_new: true,
        sold_quantity: 0,
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        axios.get("http://localhost:8080/api/products").then((res) => {
            setProducts(res.data);
        });
        axios.get("http://localhost:8080/api/categories").then((res) => {
            setCategories(res.data);
        });
    }, []);

    const handleAddProduct = () => {
        if (
            !newProduct.name_product ||
            !newProduct.price ||
            newProduct.in_stock <= 0 ||
            !newProduct.idCat ||
            !newProduct.idSubcat ||
            !newProduct.status ||
            !newProduct.images ||
            !newProduct.in_stock
        ) {
            alert("Vui lòng nhập đầy đủ thông tin sản phẩm.");
            return;
        }
        axios.post("http://localhost:8080/api/products", newProduct).then((res) => {
            setProducts([...products, res.data]);
            setNewProduct({
                name_product: "",
                price: "",
                in_stock: 0,
                status: "Active",
                occasion: "",
                images: [],
                idCat: 1,
                idSubcat: 1,
                sale_price: null,
                is_sale: false,
                is_new: true,
                sold_quantity: 0,
            });
            setShowAddModal(false);
        });
    };

    const handleDeleteProduct = (id) => {
        if (window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
            axios
                .delete(`http://localhost:8080/api/products/${id}`)
                .then(() => {
                    setProducts(products.filter((product) => product.idProduct !== id));
                })
                .catch((error) => {
                    console.error("Lỗi khi xóa sản phẩm:", error);
                    alert("Xóa sản phẩm thất bại.");
                });
        }
    };


    const searchedProducts = products.filter((product) =>
        product.name_product.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminRoute>
            <div className="product-management container">
                <h2>Quản Lý Sản Phẩm</h2>

                <input
                    placeholder="Tìm kiếm sản phẩm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ marginRight: "50px" }}
                />
                <Button variant="primary" onClick={() => setShowAddModal(true)}>
                    Thêm Sản Phẩm
                </Button>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Tên sản phẩm</th>
                            <th>Giá</th>
                            <th>Giá Khuyến Mãi</th>
                            <th>Số lượng</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchedProducts.map((product) => (
                            <tr key={product.idProduct}>
                                <td>{product.name_product}</td>
                                <td>{product.price}₫</td>
                                <td>{product.sale_price ? `${product.sale_price}₫` : "N/A"}</td>
                                <td>{product.in_stock}</td>
                                <td>{product.status}</td>
                                <td>
                                    <a
                                        href={`/updateproduct/${product.idProduct}`}
                                        className="btn btn-success"
                                        style={{ marginRight: "5px" }}
                                    >
                                        Update
                                    </a>
                                    {product.status !== "Deleted" && (
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDeleteProduct(product.idProduct)}
                                        >
                                            Xóa
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Thêm Sản Phẩm Mới</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formProductName">
                                <Form.Label>Tên sản phẩm</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập tên sản phẩm"
                                    value={newProduct.name_product}
                                    onChange={(e) =>
                                        setNewProduct({ ...newProduct, name_product: e.target.value })
                                    }
                                />
                            </Form.Group>

                            <Form.Group controlId="formProductPrice">
                                <Form.Label>Giá</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Nhập giá sản phẩm"
                                    value={newProduct.price}
                                    onChange={(e) =>
                                        setNewProduct({ ...newProduct, price: e.target.value })
                                    }
                                />
                            </Form.Group>

                            <Form.Group controlId="formProductSalePrice">
                                <Form.Label>Giá Khuyến Mãi</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Nhập giá khuyến mãi nếu có"
                                    value={newProduct.sale_price || ""}
                                    onChange={(e) =>
                                        setNewProduct({ ...newProduct, sale_price: e.target.value })
                                    }
                                />
                            </Form.Group>

                            <Form.Group controlId="formProductStock">
                                <Form.Label>Số lượng</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Nhập số lượng sản phẩm"
                                    value={newProduct.in_stock}
                                    onChange={(e) =>
                                        setNewProduct({ ...newProduct, in_stock: e.target.value })
                                    }
                                />
                            </Form.Group>

                            <Form.Group controlId="formProductStatus">
                                <Form.Label>Trạng thái</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={newProduct.status}
                                    onChange={(e) =>
                                        setNewProduct({ ...newProduct, status: e.target.value })
                                    }
                                >
                                    <option value="Activate">Kích hoạt</option>
                                    <option value="Deactivate">Hủy kích hoạt</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="formProductCategory">
                                <Form.Label>Danh mục</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={newProduct.idCat}
                                    onChange={(e) => {
                                        const selectedCatId = parseInt(e.target.value);
                                        const selectedCategory = categories.find((cat) => cat.id === selectedCatId);
                                        setNewProduct({
                                            ...newProduct,
                                            idCat: selectedCatId,
                                            idSubcat: selectedCategory?.subCategories[0]?.id_subcat || "", // reset phân loại
                                        });
                                    }}
                                >
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>


                            <Form.Group controlId="formProductSubcategory">
                                <Form.Label>Phân loại</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={newProduct.idSubcat}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            idSubcat: parseInt(e.target.value),
                                        })
                                    }
                                    disabled={!newProduct.idCat}
                                >
                                    {categories
                                        .find((cat) => cat.id === newProduct.idCat)
                                        ?.subCategories.map((sub) => (
                                            <option key={sub.id_subcat} value={sub.id_subcat}>
                                                {sub.name}
                                            </option>
                                        ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="formProductOccasion">
                                <Form.Label>Dịp sử dụng</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={newProduct.occasion}
                                    onChange={(e) =>
                                        setNewProduct({ ...newProduct, occasion: e.target.value })
                                    }
                                >
                                    <option value="Đi chơi">Đi chơi</option>
                                    <option value="Đi làm">Đi làm</option>
                                    <option value="Đi tiệc">Đi tiệc</option>
                                </Form.Control>
                            </Form.Group>


                            <Form.Group controlId="formProductImages">
                                <Form.Label>Hình ảnh (URL, cách nhau dấu phẩy)</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập URL hình ảnh, cách nhau dấu phẩy"
                                    value={newProduct.images.map(img => img.imageLink).join(", ")}
                                    onChange={(e) => {
                                        const urls = e.target.value.split(",").map((url) => url.trim());
                                        const imageObjects = urls.map(url => ({ imageLink: url }));
                                        setNewProduct({
                                            ...newProduct,
                                            images: imageObjects,
                                        });
                                    }}
                                />

                            </Form.Group>

                            <Form.Group controlId="formSoldQuantity">
                                <Form.Label>Số lượng đã bán</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Nhập số lượng đã bán"
                                    value={newProduct.sold_quantity}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            sold_quantity: e.target.value,
                                        })
                                    }
                                />
                            </Form.Group>

                            <Form.Group controlId="formIsNew">
                                <Form.Label>Sản phẩm mới</Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    label="Đánh dấu là sản phẩm mới"
                                    checked={newProduct.is_new}
                                    onChange={(e) =>
                                        setNewProduct({ ...newProduct, is_new: e.target.checked })
                                    }
                                />
                            </Form.Group>

                            <Form.Group controlId="formIsSale">
                                <Form.Label>Giảm giá</Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    label="Đánh dấu là sản phẩm đang giảm giá"
                                    checked={newProduct.is_sale}
                                    onChange={(e) =>
                                        setNewProduct({ ...newProduct, is_sale: e.target.checked })
                                    }
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                            Đóng
                        </Button>
                        <Button variant="primary" onClick={handleAddProduct}>
                            Thêm
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </AdminRoute>
    );
};

export default ProductManagement;