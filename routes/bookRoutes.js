import express from "express";
import {
  availabilityController,
  borrowBookController,
  createBookController,
  getBooksController,
  searchBookController,
} from "../controller/bookController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/get-books/", requireSignIn, isAdmin, getBooksController);
router.post("/create-book", requireSignIn, isAdmin, createBookController);
router.get("/search-book/:slug", requireSignIn, searchBookController);
router.post("/availability/:book_id", requireSignIn, availabilityController);
router.post("/borrow-book", requireSignIn, borrowBookController);

export default router;
