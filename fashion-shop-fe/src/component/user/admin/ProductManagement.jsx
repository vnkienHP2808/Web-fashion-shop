import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminRoute from "./AdminRoute";
import { Modal, Button, Form, Table } from "react-bootstrap";

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        inStock: 0,
        status: "Activate",
        occasion: "",
        images: [],
        categoryId: 1,
        subcategoryId: 1,
        salePrice: null,
        isSale: false,
        isNew: true,
        soldQuantity: 0,
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        axios.get("http://localhost:9999/products").then((res) => {
            setProducts(res.data);
        });
        axios.get("http://localhost:9999/categories").then((res) => {
            setCategories(res.data);
        });
    }, []);

    const handleAddProduct = () => {
        if (
            !newProduct.name ||
            !newProduct.price ||
            newProduct.inStock <= 0 ||
            !newProduct.categoryId ||
            !newProduct.subcategoryId ||
            !newProduct.status ||
            !newProduct.images ||
            !newProduct.inStock
        ) {
            alert("Vui lòng nhập đầy đủ thông tin sản phẩm.");
            return;
        }
        axios.post("http://localhost:9999/products", newProduct).then((res) => {
            setProducts([...products, res.data]);
            setNewProduct({
                name: "",
                price: "",
                inStock: 0,
                status: "Activate",
                occasion: "",
                images: [],
                categoryId: 1,
                subcategoryId: 1,
                salePrice: null,
                isSale: false,
                isNew: true,
                soldQuantity: 0,
            });
            setShowAddModal(false);
        });
    };

    const handleDeleteProduct = (id) => {
        const updatedProduct = products.find((product) => product.id === id);
        updatedProduct.status = "Deleted";
        axios
            .put(`http://localhost:9999/products/${id}`, updatedProduct)
            .then(() => {
                setProducts(
                    products.map((product) =>
                        product.id === id ? updatedProduct : product
                    )
                );
            });
    };

    const searchedProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.price}₫</td>
                                <td>{product.salePrice ? `${product.salePrice}₫` : "N/A"}</td>
                                <td>{product.inStock}</td>
                                <td>{product.status}</td>
                                <td>
                                    <a
                                        href={`/updateproduct/${product.id}`}
                                        className="btn btn-success"
                                        style={{ marginRight: "5px" }}
                                    >
                                        Update
                                    </a>
                                    {product.status !== "Deleted" && (
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDeleteProduct(product.id)}
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
                                    value={newProduct.name}
                                    onChange={(e) =>
                                        setNewProduct({ ...newProduct, name: e.target.value })
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
                                    value={newProduct.salePrice || ""}
                                    onChange={(e) =>
                                        setNewProduct({ ...newProduct, salePrice: e.target.value })
                                    }
                                />
                            </Form.Group>

                            <Form.Group controlId="formProductStock">
                                <Form.Label>Số lượng</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Nhập số lượng sản phẩm"
                                    value={newProduct.inStock}
                                    onChange={(e) =>
                                        setNewProduct({ ...newProduct, inStock: e.target.value })
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
                                    value={newProduct.categoryId}
                                    onChange={(e) => {
                                        const categoryId = parseInt(e.target.value);
                                        const selectedCategory = categories.find(
                                            (cat) => cat.id === categoryId
                                        );
                                        setNewProduct({
                                            ...newProduct,
                                            categoryId,
                                            subcategoryId:
                                                selectedCategory?.subcategories[0]?.id || 1,
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
                                    value={newProduct.subcategoryId}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            subcategoryId: parseInt(e.target.value),
                                        })
                                    }
                                >
                                    {categories
                                        .find((cat) => cat.id === newProduct.categoryId.toString())
                                        ?.subcategories.map((sub) => (
                                            <option key={sub.id} value={sub.id}>
                                                {sub.name}
                                            </option>
                                        ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="formProductImages">
                                <Form.Label>Hình ảnh (URL, cách nhau dấu phẩy)</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập URL hình ảnh, cách nhau dấu phẩy"
                                    value={newProduct.images.join(", ")}
                                    onChange={(e) => {
                                        const urls = e.target.value
                                            .split(",")
                                            .map((url) => url.trim());
                                        setNewProduct({
                                            ...newProduct,
                                            images: urls,
                                        });
                                    }}
                                />
                            </Form.Group>

                            <Form.Group controlId="formSoldQuantity">
                                <Form.Label>Số lượng đã bán</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Nhập số lượng đã bán"
                                    value={newProduct.soldQuantity}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            soldQuantity: e.target.value,
                                        })
                                    }
                                />
                            </Form.Group>

                            <Form.Group controlId="formIsNew">
                                <Form.Label>Sản phẩm mới</Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    label="Đánh dấu là sản phẩm mới"
                                    checked={newProduct.isNew}
                                    onChange={(e) =>
                                        setNewProduct({ ...newProduct, isNew: e.target.checked })
                                    }
                                />
                            </Form.Group>

                            <Form.Group controlId="formIsSale">
                                <Form.Label>Giảm giá</Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    label="Đánh dấu là sản phẩm đang giảm giá"
                                    checked={newProduct.isSale}
                                    onChange={(e) =>
                                        setNewProduct({ ...newProduct, isSale: e.target.checked })
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