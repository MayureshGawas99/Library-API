import express from "express";
import {
  getUsersController,
  loginController,
  signUpController,
} from "../controller/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();
//auth routes
router.post("/get-users", requireSignIn, isAdmin, getUsersController);
router.post("/signup", signUpController);
router.post("/login", loginController);
// router.post("/forgot-password", forgotPasswordController);

router.get("/test", requireSignIn, isAdmin, async (req, res) => {
  try {
    res.status(200).send({ user: req.user });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

export default router;
