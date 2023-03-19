import express from 'express'
const router = express.Router()
import { protect, admin } from '../middleware/authMiddleware.js';
import {
    getLowInStockProducts,
    getNewUserOnboardedThisMonth,
    getNetSaleThisFY,
    getNetSaleThisMonth,
    getOutOfStockProducts,
    getProcessingOrdersCount
} from '../controllers/analyticsController.js'

router.route('/net-sale-this-fy').get(protect, admin, getNetSaleThisFY)
router.route('/net-sale-this-month').get(protect, admin, getNetSaleThisMonth)
router.route('/out-of-stock-products').get(protect, admin, getOutOfStockProducts)
router.route('/low-in-stock-products').get(protect, admin, getLowInStockProducts)
router.route('/new-user-onboarded-this-month').get(protect, admin, getNewUserOnboardedThisMonth)
router.route('/processing-order-count').get(protect, admin, getProcessingOrdersCount)

export default router
