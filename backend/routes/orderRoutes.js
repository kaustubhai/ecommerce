import express from 'express'
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDispatched,
  getMyOrders,
  getOrders,
  applyCoupon,
  addCoupons,
  deleteCoupons,
  getCoupons,
  checkCourierService
} from '../controllers/orderController.js'
import { protect, admin } from '../middleware/authMiddleware.js'
const router = express.Router()

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders)
router.route('/myorders').get(protect, getMyOrders)
router.route('/:id').get(protect, getOrderById)
router.route('/:id/pay').put(protect, updateOrderToPaid)
router.route('/:id/deliver').put(protect, admin, updateOrderToDispatched)
router.route('/coupons/:code').patch(protect, applyCoupon)
router.route('/coupons/get').get(protect, admin, getCoupons)
router.route('/coupons').post(protect, admin, addCoupons)
router.route('/coupons/:code').delete(protect, admin, deleteCoupons)
router.route('/courier/service').post(protect, checkCourierService)

export default router
