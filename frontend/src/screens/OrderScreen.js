import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
// import Razorpay from 'razorpay'
import { Link } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card, Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from '../actions/orderActions'
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from '../constants/orderConstants'
import Helmet from 'react-helmet'

const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id

  const [sdkReady, setSdkReady] = useState(false)
  const [trackingUrl, setTrackingUrl] = useState('')
  const dispatch = useDispatch()

  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingPay, success: successPay } = orderPay

  const orderDeliver = useSelector((state) => state.orderDeliver)
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  if (!loading && order) {
    //   Calculate prices
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100)?.toFixed(2)
    }

    order.itemsPrice = addDecimals(
      order?.orderItems.reduce((acc, item) => acc + item?.price * item.qty, 0)
    )
}

let rzp1;

  const openRazor = () => {
      var options = {
        "key_id": process.env.RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        "amount": order?.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "KroShop",
        "description": `You are buying ${order?.orderItems.length} items, worth ${order?.amount}, from KroShop`,
        "image": "https://example.com/your_logo",
        "order_id": order?.rpId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response){
            dispatch(payOrder(orderId, response))
        },
        "prefill": {
            "name": order.user.name,
            "email": order.user.email,
        },
        "notes": {
            "address": `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`
        },
        "theme": {
            "color": "#3399cc"
        }
      }
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://checkout.razorpay.com/v1/checkout.js`
      script.async = true
      script.onload = () => {
        rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response){
          alert(response.error.code);
          alert(response.error.description);
          alert(response.error.source);
          alert(response.error.step);
          alert(response.error.reason);
          alert(response.error.metadata.order_id);
          alert(response.error.metadata.payment_id);
        });
        rzp1.open();
      }
      document.body.appendChild(script)
    }

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal')
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true
      script.onload = () => {
        setSdkReady(true)
      }
      document.body.appendChild(script)
    }

    if (!order || successPay || successDeliver || order._id !== orderId) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch({ type: ORDER_DELIVER_RESET })
      dispatch(getOrderDetails(orderId))
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript()
      } else {
        setSdkReady(true)
      }
    }
  }, [dispatch, orderId, successPay, successDeliver, order])

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult))
  }

  const deliverHandler = () => {
    dispatch(deliverOrder(order, trackingUrl))
  }

  const printDiv = () => {
    var printContents = document.getElementById('main').innerHTML
    var originalContents = document.body.innerHTML

    document.body.innerHTML = printContents

    window.print()

    document.body.innerHTML = originalContents
  }

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
    <Helmet>
        <meta charSet="utf-8" />
        <title>Your Order #{orderId || ''} | KroShop</title>
        <link rel="canonical" />
    </Helmet>
          {(userInfo && userInfo.isAdmin) ? <Button onClick={() => history.goBack()} className='btn btn-light my-3 d-print-none'>
        Go Back
          </Button> : <Link to='/profile' className='btn btn-light my-3'>
        See Orders
          </Link>
      }
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{' '}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Phone: </strong>{' '}
                <a href={`tel:${order.user.phone}`}>{order.user.phone}</a>
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                , {order.shippingAddress.state}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
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
                          {item.qty} x ₹{(item.price - (item.price * item.discount / 100))?.toFixed(2)?.toLocaleString('en-IN')} = ₹{(item.qty * (item.price - (item.price * item.discount / 100)))?.toFixed(2)?.toLocaleString('en-IN')}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
            {order.isPaid && (
              <ListGroup.Item>
                  <Message variant='success'>Paid on {new Date(order.paidAt).toLocaleDateString()} {new Date(order.paidAt).toLocaleTimeString()}</Message>
                {order.isDispatched ? (
                  <Message variant='success'>
                    Dispatched on {new Date(order.dispatchedAt).toLocaleDateString()} {new Date(order.dispatchedAt).toLocaleTimeString()}
                  </Message>
                ) : (
                  <Message variant='danger'>Not yet Dispatched</Message>
                )}
              </ListGroup.Item>
            )}
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
                  <Col>₹{order.itemsPrice - order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>₹{order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>₹{order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
                  {order.discount > 0 && <ListGroup.Item>
                <Row>
                  <Col>Discount</Col>
                  <Col>₹{order.discount?.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>}
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>₹{order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* {order.isPaid &&
              (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )} */}
              {/* {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDispatched && (
                    <ListGroup.Item className='d-print-none'>
                    <Form onSubmit={deliverHandler}>
                      <Form.Control
                        type='url'
                        placeholder='Enter Tracking URL'
                        className='btn btn-block border'
                        value={trackingUrl}
                        required
                        onChange={(e) => setTrackingUrl(e.target.value)}
                      />
                      <Button
                        type='submit'
                        className='btn btn-block'
                      >
                        Mark As Dispatched
                      </Button>
                    </Form>
                  </ListGroup.Item>
                )} */}
                {!order?.isPaid ? (
                    <ListGroup.Item className='d-print-none'>
                    <Button
                      type='button'
                        className='btn-block bg-danger'
                      onClick={openRazor}
                      id='rzp-button1'
                      >
                        Checkout
                    </Button>
                  </ListGroup.Item>
                ) : (
                      <ListGroup.Item className='d-print-none'>
                  <Button
                    type='button'
                          className='btn-block bg-danger'
                    onClick={printDiv}
                    >
                      Download Invoice
                  </Button>
                </ListGroup.Item>
                )}
              {loadingDeliver && <Loader />}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrderScreen
