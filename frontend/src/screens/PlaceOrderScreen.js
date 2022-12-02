import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import { createOrder } from '../actions/orderActions'
import { ORDER_CREATE_RESET } from '../constants/orderConstants'
import { USER_DETAILS_RESET } from '../constants/userConstants'
import { applyCoupon } from '../actions/cartActions'
import Helmet from 'react-helmet'

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch()
  const [coupon, setCoupon] = useState('')
  const cart = useSelector((state) => state.cart)

  if (!cart.shippingAddress.address) {
    history.push('/shipping')
  }
  //   Calculate prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100)?.toFixed(2)
  }

  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + (item.price - (item.price * item.discount / 100)) * item.qty, 0)
  )
  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100)
  cart.taxPrice = addDecimals(Number((0.18 * cart.itemsPrice)?.toFixed(2)))
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice)
  )?.toFixed(2)

  const orderCreate = useSelector((state) => state.orderCreate)
  const { order, success, error } = orderCreate

  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`)
      dispatch({ type: USER_DETAILS_RESET })
      dispatch({ type: ORDER_CREATE_RESET })
    }
    // eslint-disable-next-line
  }, [history, success])

  const checkCoupon = (e, totalPrice) => {
    e.preventDefault()
    dispatch(applyCoupon(coupon, totalPrice))
  }

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        itemsPrice: cart.itemsPrice - cart.taxPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        discount: cart.discount,
        totalPrice: cart.discount ? cart.totalPrice - cart.discount : cart.totalPrice,
      })
    )
  }

  return (
    <>
    <Helmet>
        <meta charSet="utf-8" />
        <title>Checkout | ProShop</title>
        <link rel="canonical" />
    </Helmet>
      <CheckoutSteps step1 step2 step3 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address:</strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ₹{(item.price - (item.price * item.discount / 100))?.toFixed(2).toLocaleString('en-IN')} = ₹{(item.qty * (item.price - (item.price * item.discount / 100)))?.toFixed(2).toLocaleString('en-IN')}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>₹{cart.itemsPrice - cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>₹{cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>₹{cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              {cart.discount > 0 && <ListGroup.Item>
                <Row>
                  <Col>Discount</Col>
                  <Col>-₹{cart.discount?.toLocaleString('en-IN')}</Col>
                </Row>
              </ListGroup.Item>}
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>₹{cart.discount ? (cart.totalPrice - cart.discount)?.toLocaleString('en-IN') : cart.totalPrice?.toLocaleString('en-IN')}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
              <Form onSubmit={(e) => checkCoupon(e, cart.totalPrice)} inline>
                <Form.Control
                  type='text'
                  name='coupon'
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder='Enter coupon code'
                  className='mr-sm-2'
                ></Form.Control>
                <Button disabled={coupon.length === 0} type='submit' variant='outline-success' className='p-2'>
                  Apply
                </Button>
              </Form>
              </ListGroup.Item>
              {error && <ListGroup.Item>
                <Message variant='danger'>{error}</Message>
              </ListGroup.Item>}
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block'
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
              {cart.error && <ListGroup.Item>
                  <Message variant='danger'>{cart.error}</Message>
              </ListGroup.Item>}
              {cart.discount && <ListGroup.Item>
                  <Message variant='success'>Discount of ₹ {cart.discount} applied</Message>
              </ListGroup.Item>}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrderScreen
