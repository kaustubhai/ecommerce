import express from 'express'
const router = express.Router()
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  applyCoupon,
  addCoupons,
  deleteCoupons,
  getCoupons,
} from '../controllers/orderController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders)
router.route('/myorders').get(protect, getMyOrders)
router.route('/:id').get(protect, getOrderById)
router.route('/:id/pay').put(protect, updateOrderToPaid)
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered)
router.route('/coupons/:code').patch(protect, applyCoupon)
router.route('/coupons/get').get(protect, admin, getCoupons)
router.route('/coupons').post(protect, admin, addCoupons)
router.route('/coupons/:code').delete(protect, admin, deleteCoupons)

export default router
