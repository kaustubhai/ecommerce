import express from "express";
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
  sendNewletter,
  updatePhoneNumber,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").post(registerUser).get(protect, admin, getUsers);
router.post("/login", authUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router
  .route("/wishlist")
  .get(protect, getUserWishlist)
  .put(protect, updateUserWishlist)
  .patch(protect, removeUserWishlist);
router.post("/forgotpassword", forgotPasswordRequest);
router.put("/reset/:requestId", resetPassword);
router.put("/update/phone", protect, updatePhoneNumber);
router.route("/newsletter").post(protect, admin, sendNewletter);
router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default router;
