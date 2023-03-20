import mongoose from "mongoose";

const couponSchema = mongoose.Schema([
  {
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },
    maximum: { type: Number, required: true },
    minimumPrice: { type: Number, required: true },
  },
]);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
