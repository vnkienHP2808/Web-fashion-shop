import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateProduct = () => {
    const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editProduct, setEditProduct] = useState({
    id: id,
    name: "",
    categoryId: "",
    subcategoryId: "",
    price: 0,
    salePrice: 0,
    isSale: false,
    isNew: false,
    occasion: "",
    images: [],
    soldQuantity: 0,
    inStock: 0,
  });
  const nav = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:9999/products").then((res) => {
      setProducts(res.data);
      const product = res.data.find((product) => product.id === parseInt(id));
      if (product) setEditProduct(product);
    });
    axios.get("http://localhost:9999/categories").then((res) => {
      setCategories(res.data);
    });
  }, [id]);
  useEffect(() => {
    axios
      .get("http://localhost:9999/products/" + id)
      .then((res) => setEditProduct(res.data))
      .catch((err) => console.log("err"));
  }, []);
  const handlerUpdate = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:9999/products/${id}`, editProduct)
      .then(() => {
        alert("Cập nhật thành công!");
        nav("/admin");
      })
      .catch((err) => console.log(err));
  };

  const selectedCategory = categories.find(
    (cat) => cat.id === editProduct.categoryId
  );

  return (
    <div>
      <h2>Cập nhật sản phẩm {id}</h2>
      <form onSubmit={handlerUpdate}>
        <table>
          <tbody>
            <tr>
              <td>
                <label>Id</label>
              </td>
              <td>
                <input type="text" value={editProduct.id} readOnly disabled />
              </td>
            </tr>
            <tr>
              <td>
                <label>Tên</label>
              </td>
              <td>
                <input
                  type="text"
                  value={editProduct.name}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, name: e.target.value })
                  }
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Danh mục</label>
              </td>
              <td>
                <select
                  value={editProduct.categoryId}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      categoryId: e.target.value,
                      subcategoryId: "",
                    })
                  }
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <label>Phân loại</label>
              </td>
              <td>
                <select
                  value={editProduct.subcategoryId}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      subcategoryId: e.target.value,
                    })
                  }
                  disabled={
                    !selectedCategory || !selectedCategory.subcategories?.length
                  }
                >
                  {selectedCategory?.subcategories?.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <label>Giá</label>
              </td>
              <td>
                <input
                  type="number"
                  value={editProduct.price}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, price: +e.target.value })
                  }
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Giá khuyến mãi</label>
              </td>
              <td>
                <input
                  type="number"
                  value={editProduct.salePrice}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      salePrice: +e.target.value,
                    })
                  }
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Đang giảm giá</label>
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={editProduct.isSale}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, isSale: e.target.checked })
                  }
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Hàng mới</label>
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={editProduct.isNew}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, isNew: e.target.checked })
                  }
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Occasion</label>
              </td>
              <td>
                <select
                  value={editProduct.occasion}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, occasion: e.target.value })
                  }
                >
                  <option value="Đi chơi">Đi chơi</option>
                  <option value="Đi làm">Đi làm</option>
                  <option value="Đi tiệc">Đi tiệc</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <label>Ảnh (URL, cách nhau bằng dấu phẩy)</label>
              </td>
              <td>
                <input
                  type="text"
                  value={editProduct.images.join(", ")}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      images: e.target.value
                        .split(",")
                        .map((url) => url.trim()),
                    })
                  }
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Số lượng đã bán</label>
              </td>
              <td>
                <input
                  type="number"
                  value={editProduct.soldQuantity}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      soldQuantity: +e.target.value,
                    })
                  }
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Trong kho</label>
              </td>
              <td>
                <input
                  type="number"
                  value={editProduct.inStock}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      inStock: +e.target.value,
                    })
                  }
                />
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                <button type="submit">Cập nhật</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
    );
};

export default UpdateProduct;
