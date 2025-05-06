import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminRoute from "./AdminRoute";
import { Modal, Button, Form, Table } from "react-bootstrap";
import Paginated from "../../ui/Pagination";
import Filter from "../../ui/Filter";

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
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null); 
    const [selectedPriceRange, setSelectedPriceRange] = useState(null); 
    const [selectedOccasion, setSelectedOccasion] = useState(null); 
    const [openFilter, setOpenFilter] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [productsPerPage] = useState(20);

    useEffect(() => {
        const params = {
            page: currentPage,
            size: productsPerPage,
            ...(selectedCategory && { idCat: selectedCategory }),
            ...(selectedSubCategory && { idSubcat: selectedSubCategory }),
            ...(selectedPriceRange && { priceRange: selectedPriceRange }),
            ...(selectedOccasion && { occasion: selectedOccasion }),
        };

        axios.get(`http://localhost:8080/api/products`, { params })
            .then((res) => {
                setProducts(res.data.content);
                setTotalPages(res.data.totalPages);
                setTotalElements(res.data.totalElements || 0);
            })
            .catch((err) => {
                console.error("Error fetching products:", err);
                alert("Lỗi khi tải danh sách sản phẩm. Vui lòng thử lại.");
            });
    }, [currentPage, selectedCategory, selectedSubCategory, selectedPriceRange, selectedOccasion]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/categories")
            .then((res) => setCategories(res.data))
            .catch((err) => console.error("Error fetching categories:", err));
    }, []);

    const handleAddProduct = () => {
        if (
            !newProduct.name_product ||
            !newProduct.price ||
            newProduct.in_stock <= 0 ||
            !newProduct.idCat ||
            !newProduct.idSubcat ||
            !newProduct.status ||
            newProduct.images.length === 0 ||
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
            setSelectedFiles([]);
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

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles([...selectedFiles, ...files]);
        
        const imageObjects = files.map(file => ({
            imageLink: `/assets/user/image/product/${file.name}`
        }));
        
        setNewProduct({
            ...newProduct,
            images: [...newProduct.images, ...imageObjects],
        });
    };
    
    const removeSelectedFile = (index) => {
        const updatedFiles = [...selectedFiles];
        updatedFiles.splice(index, 1);
        setSelectedFiles(updatedFiles);
        
        const updatedImages = [...newProduct.images];
        updatedImages.splice(index, 1);
        setNewProduct({
            ...newProduct,
            images: updatedImages,
        });
    };

    const handleCategoryChange = (event) => {
        const { value, checked } = event.target;
        const numberValue = Number(value);

        if (checked) {
            setSelectedCategory(numberValue);
        } else {
            setSelectedCategory(null);
        }
        setSelectedSubCategory(null);
        setCurrentPage(1);
    };

    const handleSubCategoryChange = (event) => {
        const { value, checked } = event.target;
        const numberValue = Number(value);

        if (checked) {
            setSelectedSubCategory(numberValue);
        } else {
            setSelectedSubCategory(null);
        }
        setCurrentPage(1);
    };

    const handlePriceRangeChange = (event) => {
        const { value, checked } = event.target;

        if (checked) {
            setSelectedPriceRange(value);
        } else {
            setSelectedPriceRange(null);
        }
        setCurrentPage(1);
    };

    const handleOccasionChange = (event) => {
        const { value, checked } = event.target;

        if (checked) {
            setSelectedOccasion(value);
        } else {
            setSelectedOccasion(null);
        }
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const [showAddModal, setShowAddModal] = useState(false);

    return (
        <AdminRoute>
            <div className="product-management container">
                <h2 style={{
                    color: "#333",
                    fontSize: "1.8em",
                    marginBottom: "20px",
                    textAlign: "center",
                    fontWeight: "600",
                }}>Quản Lý Sản Phẩm: <i style={{fontWeight: "normal"}}>{totalElements} sản phẩm</i></h2>

                <div className="d-flex align-items-center justify-content-between" style={{ marginBottom: "20px" }}>
                    <Button variant="primary" onClick={() => setShowAddModal(true)}>
                        Thêm Sản Phẩm
                    </Button>
                    <Filter
                        categories={categories}
                        selectedCategory={selectedCategory}
                        selectedSubCategory={selectedSubCategory}
                        handleCategoryChange={handleCategoryChange}
                        handleSubCategoryChange={handleSubCategoryChange}
                        selectedPriceRange={selectedPriceRange}
                        handlePriceRangeChange={handlePriceRangeChange}
                        selectedOccasion={selectedOccasion}
                        handleOccasionChange={handleOccasionChange}
                        openFilter={openFilter}
                        setOpenFilter={setOpenFilter}
                    />
                </div>

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
                        {products.map((product) => (
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
                                    onChange={(e) => {
                                        const ip = parseInt(e.target.value, 10);
                                        if(ip >= 0){
                                            setNewProduct({ ...newProduct, price: e.target.value })
                                        }
                                        else{
                                            setNewProduct({ ...newProduct, price: 0 })
                                        }
                                    }}
                                />
                            </Form.Group>

                            <Form.Group controlId="formProductSalePrice">
                                <Form.Label>Giá Khuyến Mãi</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Nhập giá khuyến mãi nếu có"
                                    value={newProduct.sale_price || ""}
                                    onChange={(e) => {
                                        const ip = parseInt(e.target.value, 10);
                                        if(ip >= 0){
                                            setNewProduct({ ...newProduct, sale_price: e.target.value })
                                        }
                                        else{
                                            setNewProduct({ ...newProduct, sale_price: 0 })
                                        }
                                    }}
                                />
                            </Form.Group>

                            <Form.Group controlId="formProductStock">
                                <Form.Label>Số lượng</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Nhập số lượng sản phẩm"
                                    value={newProduct.in_stock}
                                    onChange={(e) => {
                                        const ip = parseInt(e.target.value, 10);
                                        if(ip >= 0){
                                            setNewProduct({ ...newProduct, in_stock: e.target.value })
                                        }
                                        else{
                                            setNewProduct({ ...newProduct, in_stock: 0 })
                                        }
                                    }}
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
                                            idSubcat: selectedCategory?.subCategories[0]?.id_subcat || "",
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
                                <Form.Label>Hình ảnh sản phẩm</Form.Label>
                                <Form.Control
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                
                                {newProduct.images.length > 0 && (
                                    <div className="selected-files mt-2">
                                        <p>Các file đã chọn:</p>
                                        <ul className="list-group">
                                            {newProduct.images.map((image, index) => (
                                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                                    {image.imageLink}
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
                                <Form.Label>Số lượng đã bán</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Nhập số lượng đã bán"
                                    value={newProduct.sold_quantity}
                                    onChange={(e) => {
                                        const ip = parseInt(e.target.value, 10);
                                        if(ip >= 0){
                                            setNewProduct({ ...newProduct, sold_quantity: e.target.value })
                                        }
                                        else{
                                            setNewProduct({ ...newProduct, sold_quantity: 0 })
                                        }
                                    }}
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

                <div className="d-flex justify-content-center" style={{ marginTop: "20px" }}>
                    <Paginated totalPages={totalPages} currentPage={currentPage} handlePageChange={handlePageChange} />
                </div>
            </div>
        </AdminRoute>
    );
};

export default ProductManagement;