import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="block-example border-top border-gray border-bottom">
      <Container className="mt-4 mb-4">
        <Row className="justify-content-md-center">
          <Col>
          <div className="mt-3 mb-3 font-weight-bold text-dark">
          Quick Links
          </div>
          <div className="mt-4 mb-3">
          <Link to={'/books'} >Books</Link>
          </div>
          <div className="mt-3 mb-3">
          <Link to={'/books'} >Shoes</Link>
          </div>
          <div className="mt-3 mb-3">
          <Link to={'/books'} >Logbook</Link>
          </div>
          </Col>
          <Col>
          <div className="mt-3 mb-3 font-weight-bold text-dark">
          Info
          </div>
          <div className="mt-4 mb-3">
          <Link to={'/books'} >About</Link>
          </div>
          <div className="mt-3 mb-3">
          <Link to={'/books'} >Contact us</Link>
          </div>
          <div className="mt-3 mb-3">
          <Link to={'/books'} >Shipping Policy</Link>
          </div>
          <div className="mt-3 mb-3">
          <Link to={'/books'} >Blog</Link>
          </div>
          </Col>
          <Col><div className="mt-3 mb-3 font-weight-bold text-dark">
          Our Mission
          </div>
          <div className="mt-4 mb-3">
          Quality materials, good designs, craftsmanship and sustainability.
          </div>
          </Col>
        </Row>
        <Row>
          <Col>
          </Col>
          <Col>
          </Col>
          <Col>
          <div className="float-right">
          <Link to={'/books'} >
          <i class="fab fa-twitter mr-3"></i>
          </Link>
          <Link to={'/books'} >
          <i class="fab fa-facebook-square mr-3"></i>
          </Link>
          <Link to={'/books'} >
          <i class="fab fa-tiktok mr-3"></i>
          </Link>
          <Link to={'/books'} >
          <i class="fab fa-instagram mr-3"></i>
          </Link>
          <Link to={'/books'} >
          <i className='fab fa-youtube mr-3'></i> 
          </Link>
          </div>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
