import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromUserWishlist } from "../actions/userActions";
const ProductRow = ({ item, history, wishlist }) => {
  const [img, setImg] = useState("");
  const dispatch = useDispatch();
  const removeFromWishlist = (id) => {
    dispatch(removeFromUserWishlist(id));
  };

  useEffect(() => {
    setImg(item.image);
  }, [item, item.image]);

  const addToCartHandler = (id) => {
    dispatch(removeFromUserWishlist(id));
    history.push(`/cart/${id}?qty=1`);
  };

  return (
    <tr key={item._id} className="d-flex flex-row">
      <td className="col-2 d-flex flex-column justify-content-center">
        <img
          height={"150px"}
          width={"150px"}
          src={item.image}
          alt={item.name}
        />
      </td>
      <td className="col-6 d-flex flex-column justify-content-center">
        <Link to={`/product/${item._id}`}>
          <h4>{item.name}</h4>
        </Link>
        <p>{item.description}</p>
      </td>
      <td className="col-1"></td>
      <td className="col-1 d-flex flex-column justify-content-center">
        <p>{(item.price - (item.discount * item.price) / 100).toFixed(2)}</p>
      </td>
      <td className="col-2 mb-4 d-flex align-items-center justify-content-center">
        <Button
          disabled={item.countInStock === 0}
          title={item.countInStock === 0 ? "Out of stock" : "Add to Cart"}
          variant="primary"
          onClick={() => addToCartHandler(item._id)}
          className="mr-2"
        >
          <i className="fas fa-cart-plus"></i>
        </Button>
        {wishlist ? (
          <Button
            variant="secondary"
            onClick={() => removeFromWishlist(item._id)}
          >
            <i className="fas fa-trash"></i>
          </Button>
        ) : (
          <Button
            variant="secondary"
            onClick={() => history.push(`/product/${item._id}`)}
          >
            <i className="fas fa-forward"></i>
          </Button>
        )}
      </td>
    </tr>
  );
};

export default ProductRow;
