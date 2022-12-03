import express from 'express'
const router = express.Router()
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  forgotPasswordRequest,
  resetPassword,
  getUserWishlist,
  updateUserWishlist,
  removeUserWishlist,
} from '../controllers/userController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').post(registerUser).get(protect, admin, getUsers)
router.post('/login', authUser)
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
  router.route('/wishlist')
  .get(protect, getUserWishlist)
  .put(protect, updateUserWishlist)
  .patch(protect, removeUserWishlist)
  router.post('/forgotpassword', forgotPasswordRequest)
  router.put('/reset/:requestId', resetPassword)
  router
    .route('/:id')
    .delete(protect, admin, deleteUser)
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser)

export default router
