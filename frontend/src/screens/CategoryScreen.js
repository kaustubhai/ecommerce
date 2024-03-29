import React, { useEffect } from "react";
import { Row, Col, Table, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Product from "../components/Product";
import { getProductsByCategory } from "../actions/productActions";
import ProductRow from "../components/ProductRow";
import Banner from "../components/Banner";

const CategoryScreen = ({ history, match }) => {
  const category = match.params.category;
  const dispatch = useDispatch();
  useEffect(() => {
    if (category.trim() !== "") {
      dispatch(getProductsByCategory(category));
    }
  }, [category, dispatch, match]);

  const productList = useSelector((state) => state.productList);
  const { loading, products } = productList;

  return (
    <div>
      {loading && <Spinner />}

      <Banner category={category} active={false} />
      <h1 className="text-center mt-1">Top {match.params.category} Products</h1>
      <Row className="justify-content-center">
        {products &&
          products.slice(0, 4).map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
      </Row>
      {products.length > 4 && (
        <h1 className="text-center mt-5">
          Browse More <i className="fa fa-chevron-down"></i>{" "}
        </h1>
      )}
      {products &&
        products.slice(4).map((product) => (
          <Table hover responsive className="table-sm">
            <ProductRow item={product} history={history} wishlist={false} />
          </Table>
        ))}
    </div>
  );
};

export default CategoryScreen;
