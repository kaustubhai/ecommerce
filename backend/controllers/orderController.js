import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'
import Coupon from '../models/couponModel.js'
import Product from '../models/productModel.js'
// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
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
        return
      }
      console.log(product.countInStock);
      await product.save()
    })

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    })

    const createdOrder = await order.save()

    res.status(201).json(createdOrder)
  }
})

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
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
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    }

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()

    const updatedOrder = await order.save()

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
  const isValid = await Coupon.findOne({ code })
  console.log({code})
  if (isValid) {
    res.json({discount: isValid.discount})
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
  console.log(coupons)
  res.json(coupons)
})

// @desc    Add Coupons
// @route   POST /api/coupons
// @access  Private/Admin
const addCoupons = asyncHandler(async (req, res) => {
  const { code, discount } = req.body
  console.log(code, discount);
  const coupon = new Coupon({
    code,
    discount
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
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  applyCoupon,
  getCoupons,
  addCoupons,
  deleteCoupons
}
