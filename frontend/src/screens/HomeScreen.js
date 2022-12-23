import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Button } from 'react-bootstrap'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'
import Meta from '../components/Meta'
import { listProducts } from '../actions/productActions'
import Banner from '../assets/Homepage.jpg'
const HomeScreen = ({ match }) => {
  const keyword = match.params.keyword

  const pageNumber = match.params.pageNumber || 1

  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)
  const { loading, error, products, page, pages } = productList

  const productTopRated = useSelector((state) => state.productTopRated)
  const topProducts = productTopRated.products

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber))
  }, [dispatch, keyword, pageNumber])

  return (
    <>
      <Meta />
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to='/' className='btn btn-light'>
          Go Back
        </Link>
      )}
      <h1 className='text-center' style={{ marginTop: '24.5rem' }}>Top Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Row>
            {topProducts.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <div className='d-flex justify-content-center align-items-center' style={{ backgroundColor: '#000', position: 'relative', height: '400px' }}>
          <Link to={'/category/electronics'} style={{ zIndex: 20, boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}><Button style={{fontSize: '1.2rem', fontWeight: 'bold'}} variant='secondary'>Shop Electronics</Button></Link>
            <img src={Banner} alt="" className='w-100' style={{ height: '400px', position: 'absolute', zIndex:0, opacity: 0.6, objectFit: 'cover' }}/>
          </div>
      <h1 className='text-center mt-4'>Latest Products</h1>
      <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ''}
          />
        </>
      )}
    </>
  )
}

export default HomeScreen
