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

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    console.log("Token:", token ? "EXISTS ✅" : "NULL ❌");
    console.log("Image:", image);
    console.log("Image size:", image?.size);
    console.log("Image type:", image?.type);

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

    // ✅ Validate image size — max 5MB
    if (image.size > 5 * 1024 * 1024) {
      toast.error("Image too large! Maximum size is 5MB");
      setLoading(false);
      return;
    }

    // ✅ Validate image type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(image.type)) {
      toast.error("Only JPG and PNG images are allowed!");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("rating", data.rating);
    formData.append("image", image);

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

      console.log("Response:", response.data);

      if (response.data.success) {
        toast.success("Food item added successfully!");
        setData({
          name: "",
          description: "",
          price: "",
          category: "Salad",
          rating: 0,
        });
        setImage(null);
      } else {
        toast.error(response.data.message || "Failed to add food");
      }
    } catch (error) {
      console.error("FORM ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
      toast.error(
        error.response?.data?.message ||
        "Failed to add product. Server error."
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
            accept="image/jpeg, image/png, image/jpg"
            onChange={(e) => setImage(e.target.files[0])}
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

        {/* Submit Button */}
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