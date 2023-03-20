import axios from "axios";
import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { listProductDetails, updateProduct } from "../actions/productActions";
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants";
import Helmet from "react-helmet";
import CreatableSelect from "react-select/creatable";

const ProductEditScreen = ({ match, history }) => {
  const productId = match.params.id;

  const [name, setName] = useState("");
  const [mrp, setMrp] = useState(0);
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState("");
  const [secondaryImage, setSecondaryImage] = useState("");
  const [brand, setBrand] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [categoryDropdown, setCategoryDropdown] = useState([]);
  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      history.push("/admin/productlist");
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId));
      } else {
        setName(product.name);
        setMrp(product.mrp);
        setPrice(product.price);
        setDiscount(product.discount);
        setImage(product.image);
        setSecondaryImage(product.secondaryImage);
        setBrand(product.brand);
        setSelectedOption(product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);
        setTags(product.tags.join(", "));
      }
    }
  }, [dispatch, history, productId, product, successUpdate]);

  useEffect(() => {
    (async () => {
      const data = await axios.get("/api/products/categories");
      setCategoryDropdown(data.data);
    })();
  }, []);

  const options = categoryDropdown.map((cate) => ({
    label: cate,
    value: cate,
  }));

  const uploadFileHandler = async (e, pos) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.post("/api/upload", formData, config);

      pos === 1 ? setImage(data) : setSecondaryImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        discount,
        mrp,
        image,
        secondaryImage,
        brand,
        category: selectedOption.value,
        description,
        tags,
        countInStock,
      })
    );
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Edit Product | KroShop</title>
        <link rel="canonical" />
      </Helmet>
      <Button onClick={() => history.goBack()} className="btn btn-light my-3">
        Go Back
      </Button>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="mrp">
              <Form.Label>MRP</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter MRP"
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="discount">
              <Form.Label>Discount %</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter discount percent"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.File
                id="image-file"
                label="Choose File"
                custom
                onChange={(event) => uploadFileHandler(event, 1)}
              ></Form.File>
              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId="secondaryImage">
              <Form.Label>Second Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image url"
                value={secondaryImage}
                onChange={(e) => setSecondaryImage(e.target.value)}
              ></Form.Control>
              <Form.File
                id="image-file-2"
                label="Choose File"
                custom
                onChange={(event) => uploadFileHandler(event, 2)}
              ></Form.File>
              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="countInStock">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter countInStock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <CreatableSelect
                defaultValue={product.category}
                onChange={setSelectedOption}
                options={options}
              />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter comma seperated tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
