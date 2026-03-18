import React, { useState } from "react";
import "./Add.css";
import axios from "axios";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";

const Add = ({ url }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
    rating: 0,
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRating = (value) => {
    setData((prev) => ({ ...prev, rating: value }));
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);
    console.log("File name:", file?.name);
    console.log("File size:", file?.size);
    console.log("File type:", file?.type);
    setImage(file);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    console.log("=== SUBMIT START ===");
    console.log("Token:", token ? "EXISTS ✅" : "NULL ❌");
    console.log("Image state:", image);
    console.log("Image size:", image?.size);
    console.log("Image type:", image?.type);
    console.log("Form data:", data);

    if (!token) {
      toast.error("Admin not logged in. Please login again.");
      setLoading(false);
      return;
    }

    if (!image) {
      toast.error("Please upload an image");
      setLoading(false);
      return;
    }

    if (image.size > 5 * 1024 * 1024) {
      toast.error("Image too large! Maximum 5MB");
      setLoading(false);
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg","image/webp"];
    if (!allowedTypes.includes(image.type)) {
      toast.error("Only JPG, PNG and WEBP images allowed!");
      setLoading(false);
      return;
    }

    // ✅ Build FormData
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("rating", Number(data.rating));
    formData.append("image", image);

    // ✅ Debug FormData
    console.log("=== FORMDATA CHECK ===");
    console.log("name:", formData.get("name"));
    console.log("description:", formData.get("description"));
    console.log("price:", formData.get("price"));
    console.log("category:", formData.get("category"));
    console.log("rating:", formData.get("rating"));
    console.log("image:", formData.get("image"));
    console.log("image name:", formData.get("image")?.name);
    console.log("image size:", formData.get("image")?.size);
    console.log("=====================");

    try {
      const response = await axios.post(
        `${url}/api/food/add`,
        formData,
        {
          headers: {
            token: token,
          },
        }
      );

      console.log("Server response:", response.data);

      if (response.data.success) {
        toast.success("Food item added successfully! ✅");
        setData({
          name: "",
          description: "",
          price: "",
          category: "Salad",
          rating: 0,
        });
        setImage(null);
        // ✅ Reset file input
        document.getElementById("image").value = "";
      } else {
        toast.error(response.data.message || "Failed to add food");
      }
    } catch (error) {
      console.error("=== ERROR ===");
      console.error("Error message:", error.message);
      console.error("Server error:", error.response?.data);
      console.error("Status:", error.response?.status);
      toast.error(
        error.response?.data?.message ||
        "Failed to add product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add">
      <form className="add-form flex-col" onSubmit={onSubmitHandler}>

        {/* Image Upload */}
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt="upload"
            />
          </label>
          <input
            type="file"
            id="image"
            hidden
            accept="image/jpeg, image/png, image/jpg, image/webp"
            onChange={onImageChange}
          />
        </div>

        {/* Product Name */}
        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input
            type="text"
            name="name"
            placeholder="Type here"
            value={data.name}
            onChange={onChangeHandler}
            required
            disabled={loading}
          />
        </div>

        {/* Product Description */}
        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea
            name="description"
            rows="6"
            placeholder="Write content here"
            value={data.description}
            onChange={onChangeHandler}
            required
            disabled={loading}
          />
        </div>

        {/* Category and Price */}
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select
              name="category"
              value={data.category}
              onChange={onChangeHandler}
              disabled={loading}
            >
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
              <option value="Biryani">Biryani</option>
              <option value="Parotta">Parotta</option>
              <option value="Pizza">Pizza</option>
              <option value="Burger">Burger</option>
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Product Price</p>
            <input
              type="number"
              name="price"
              placeholder="₹"
              value={data.price}
              onChange={onChangeHandler}
              required
              min="1"
              disabled={loading}
            />
          </div>
        </div>

        {/* Rating */}
        <div className="add-rating">
          <p>Rating</p>
          <div className="star-container">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${data.rating >= star ? "selected" : ""}`}
                onClick={() => !loading && handleRating(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="add-btn"
          disabled={loading}
        >
          {loading ? "Adding..." : "ADD"}
        </button>

      </form>
    </div>
  );
};

export default Add;