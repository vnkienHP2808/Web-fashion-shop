import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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
  });
  const nav = useNavigate();

  // Fetch product and categories
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/products/${id}`)
      .then((res) => setEditProduct(res.data))
      .catch((err) => console.error("Error fetching product", err));

    axios
      .get("http://localhost:8080/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories", err));
  }, [id]);

  // Reset subcategory if category changes
  useEffect(() => {
    setEditProduct((prev) => ({ ...prev, idSubcat: "" }));
  }, [editProduct.idCat]);

  const handleUpdate = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:8080/api/products/${id}`, editProduct)
      .then(() => {
        alert("Cập nhật thành công!");
        nav("/admin");
      })
      .catch((err) => console.error("Update failed", err));
  };

  const selectedCategory = categories.find(
    (cat) => cat.id === Number(editProduct.idCat)
  );

  return (
    <div>
      <h2>Cập nhật sản phẩm {id}</h2>
      <form onSubmit={handleUpdate}>
        <table>
          <tbody>
            <tr>
              <td><label>Id</label></td>
              <td>
                <input type="text" value={editProduct.idProduct} readOnly disabled />
              </td>
            </tr>
            <tr>
              <td><label>Tên</label></td>
              <td>
                <input
                  type="text"
                  value={editProduct.name_product}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, name_product: e.target.value })
                  }
                />
              </td>
            </tr>
            <tr>
              <td><label>Danh mục</label></td>
              <td>
                <select
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
                </select>
              </td>
            </tr>
            <tr>
              <td><label>Phân loại</label></td>
              <td>
                <select
                  value={editProduct.idSubcat}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, idSubcat: e.target.value })
                  }
                  disabled={!selectedCategory?.subCategories?.length}
                >
                  {selectedCategory?.subCategories?.map((sub) => (
                    <option key={sub.id_subcat} value={sub.id_subcat}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td><label>Giá</label></td>
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
              <td><label>Giá khuyến mãi</label></td>
              <td>
                <input
                  type="number"
                  value={editProduct.sale_price}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, sale_price: +e.target.value })
                  }
                />
              </td>
            </tr>
            <tr>
              <td><label>Đang giảm giá</label></td>
              <td>
                <input
                  type="checkbox"
                  checked={editProduct.is_sale}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, is_sale: e.target.checked })
                  }
                />
              </td>
            </tr>
            <tr>
              <td><label>Hàng mới</label></td>
              <td>
                <input
                  type="checkbox"
                  checked={editProduct.is_new}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, is_new: e.target.checked })
                  }
                />
              </td>
            </tr>
            <tr>
              <td><label>Occasion</label></td>
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
              <td><label>Ảnh (URLs, cách nhau bằng dấu phẩy)</label></td>
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
              <td><label>Đã bán</label></td>
              <td>
                <input
                  type="number"
                  value={editProduct.sold_quantity}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, sold_quantity: +e.target.value })
                  }
                />
              </td>
            </tr>
            <tr>
              <td><label>Trong kho</label></td>
              <td>
                <input
                  type="number"
                  value={editProduct.in_stock}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, in_stock: +e.target.value })
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
