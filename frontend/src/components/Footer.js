import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className=" border-top border-gray bg-dark pt-5 pb-5 text-white border-bottom mt-5">
      <Container className="mt-4 mb-4">
        <h2 className="text-white">Kroshop</h2>
        <hr className="border-light" />
        <Row className="justify-content-md-center">
          <Col>
            <div className="mt-3 mb-3 font-weight-bold text-white">
              Quick Links
            </div>
            <div className="mt-4 mb-3">
              <Link className="text-white" to={"/books"}>
                Books
              </Link>
            </div>
            <div className="mt-3 mb-3">
              <Link className="text-white" to={"/books"}>
                Shoes
              </Link>
            </div>
            <div className="mt-3 mb-3">
              <Link className="text-white" to={"/books"}>
                Logbook
              </Link>
            </div>
          </Col>
          <Col>
            <div className="mt-3 mb-3 font-weight-bold text-white">Info</div>
            <div className="mt-4 mb-3">
              <Link className="text-white" to={"/books"}>
                About
              </Link>
            </div>
            <div className="mt-3 mb-3">
              <Link className="text-white" to={"/books"}>
                Contact us
              </Link>
            </div>
            <div className="mt-3 mb-3">
              <Link className="text-white" to={"/books"}>
                Shipping Policy
              </Link>
            </div>
            <div className="mt-3 mb-3">
              <Link className="text-white" to={"/books"}>
                Blog
              </Link>
            </div>
          </Col>
          <Col>
            <div className="mt-3 mb-3 font-weight-bold text-white">
              Our Mission
            </div>
            <div className="mt-4 mb-3  text-white">
              Quality materials, good designs, craftsmanship and sustainability.
            </div>
          </Col>
        </Row>
        <Row>
          <Col></Col>
          <Col></Col>
          <Col>
            <div className="float-right">
              <Link to={"/books"}>
                <i class="fab fa-twitter mr-3 text-white"></i>
              </Link>
              <Link to={"/books"}>
                <i class="fab fa-facebook-square mr-3 text-white"></i>
              </Link>
              <Link to={"/books"}>
                <i class="fab fa-tiktok mr-3 text-white"></i>
              </Link>
              <Link to={"/books"}>
                <i class="fab fa-instagram mr-3 text-white"></i>
              </Link>
              <Link to={"/books"}>
                <i className="fab fa-youtube mr-3 text-white"></i>
              </Link>
            </div>
          </Col>
        </Row>
        {/* <Row className="mt-3 justify-content-center">
          <Col className="col-3">
          <img src="/images/visa2.svg" style={{height:"40px"}}></img>
          <img src="/images/mastercard.png" style={{height:"35px"}}></img>
          <img src="/images/amex.png" style={{height:"35px"}}></img>
          <img src="/images/paypal3.png" style={{height:"40px"}}></img>
          <img src="/images/discover.png" style={{height:"40px"}}></img>
          </Col>
        </Row> */}
        <Row className="mt-3 justify-content-center">
          <Col className="text-center py-3">Copyright &copy; KroShop</Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
