import express from "express";
import {
  listPayments,
  getPaymentStats,
  getPayment,
  createPayment,
  refundPayment,
} from "../controllers/paymentController.js";
import { protect, requirePermission } from "../middleware/auth.js";

const router = express.Router();

const read = requirePermission("payments", "read");
const write = requirePermission("payments", "write");

router.use(protect)

router.get("/stats", read, getPaymentStats); // must stay above /:id
router.get("/", read, listPayments);
router.get("/:id", read, getPayment);

router.post("/", write, createPayment);
router.post("/:id/refund", write, refundPayment);

export default router;