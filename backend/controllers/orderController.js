import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'
import Coupon from '../models/couponModel.js'
import Product from '../models/productModel.js'
import Razorpay from 'razorpay'
import emailer from '../utils/mailConfig.js'
import generateTemplate from '../utils/orderCreatedMail.js'
import generateTemplate2 from '../utils/orderDispatchedMail.js'
// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    discount
  } = req.body

  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error('No order items')
    return
  } else {

    orderItems.map(async (item) => {
      const product = await Product.findById(item.product)
      product.countInStock -= item.qty
      if(product.countInStock < 0) {
        res.status(400)
        throw new Error('Not enough stock')
      }
      await product.save()
    })


 
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      discount
    })

    const createdOrder = await order.save()

    const options = {
      amount: (totalPrice * 100)?.toFixed(0), // amount in the smallest currency unit
      currency: "INR",
      receipt: createdOrder._id.toString(),
    };

    console.log({ options, createdOrder});

    instance.orders.create(options, function(err, order) {
      createdOrder.rpId = order.id
      createdOrder.save()
      res.json(createdOrder)
    });
  }
})

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email phone'
  )

  if (order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (order) {
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult.paymentId = req.body.razorpay_payment_id
    order.paymentResult.orderId = req.body.razorpay_order_id
    order.paymentResult.signature = req.body.razorpay_signature

    const updatedOrder = await order.save()

    emailer({
      to: req.user.email,
      subject: `Order placed, congratulations!`,
      body: generateTemplate(order, req.user.name, req.user.email)
    });
    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDispatched = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  const { trackingUrl } = req.body

  if (order) {
    order.isDispatched = true
    order.dispatchedAt = Date.now()
    order.trackingUrl = trackingUrl
    const updatedOrder = await order.save()
    emailer({
      to: req.user.email,
      subject: `WooHoo! Order dispatched`,
      body: generateTemplate2(order, req.user.name, req.user.email)
    })
    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
  res.json(orders)
})

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name')
  res.json(orders)
})

// @desc    Return discount for coupon
// @route   GET /api/coupons/:code
// @access  Private
const applyCoupon = asyncHandler(async (req, res) => {
  const { code } = req.params
  const { total } = req.body
  const isValid = await Coupon.findOne({ code })
  if (isValid && total >= isValid.minimumPrice) {
    res.json({discount: isValid.discount, maximum: isValid.maximum})
  } else if (isValid && total < isValid.minimumPrice) {
    res.status(400)
    throw new Error(`Coupon applicable only for orders above ${isValid.minimumPrice}`)
  } else {
    res.status(400)
    throw new Error('Invalid coupon')
  }
})

// @desc    Get all Coupons
// @route   GET /api/coupons/get
// @access  Private/Admin
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({})
  res.json(coupons)
})

// @desc    Add Coupons
// @route   POST /api/coupons
// @access  Private/Admin
const addCoupons = asyncHandler(async (req, res) => {
  const { code, discount, maximum, minimumPrice } = req.body
  const coupon = new Coupon({
    code,
    discount,
    maximum,
    minimumPrice
  })
  const createdCoupon = await coupon.save()
  res.json(createdCoupon)
})

// @desc    Remove Coupons
// @route   DELETE /api/coupons
// @access  Private/Admin
const deleteCoupons = asyncHandler(async (req, res) => {
  const { code } = req.params
  const coupon = await Coupon.findOne({ code })
  if (coupon) {
    await coupon.remove()
    res.json({ message: 'Coupon removed' })
  } else {
    res.status(404)
    throw new Error('Coupon not found')
  }
})

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDispatched,
  getMyOrders,
  getOrders,
  applyCoupon,
  getCoupons,
  addCoupons,
  deleteCoupons
}
