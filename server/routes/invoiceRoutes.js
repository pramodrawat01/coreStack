import express from "express";
// Copy these two imports from productRoutes.js if the paths/names differ
import { protect } from "../middleware/auth.js";
import { requirePermission } from "../middleware/auth.js";
import {
  listInvoices,
  getInvoiceStats,
  getInvoice,
  createInvoice,
  updateInvoice,
  sendInvoice,
  recordPayment,
  voidInvoice,
  deleteInvoice,
} from "../controllers/invoiceController.js";

const router = express.Router();
const read = requirePermission("invoices", "read");
const write = requirePermission("invoices", "write");

router.use(protect);

router.get("/stats", read, getInvoiceStats); // must stay above /:id
router.get("/", read, listInvoices);
router.get("/:id", read, getInvoice);

router.post("/", write, createInvoice);
router.put("/:id", write, updateInvoice);
router.post("/:id/send", write, sendInvoice);
router.post("/:id/payments", write, recordPayment);
router.post("/:id/void", write, voidInvoice);
router.delete("/:id", write, deleteInvoice);

export default router;