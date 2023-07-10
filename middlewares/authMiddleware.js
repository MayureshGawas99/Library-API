import JWT from "jsonwebtoken";
import { showError } from "../helper/authHelper.js";
import { db } from "../db/db.js";

export const requireSignIn = async (req, res, next) => {
  try {
    if (!req.headers.authorization) showError(res, { message: "No token" });
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    showError(res, error);
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    db.query(
      "SELECT * FROM users WHERE id = ?",
      [req.user.id],
      (error, result) => {
        if (error) showError(res, error);
        if (result[0].role !== 1) {
          return res.status(201).send({
            success: false,
            message: "Unauthorized Access",
          });
        } else {
          next();
        }
      }
    );
  } catch (error) {
    showError(res, error, "Error in Admin Middleware");
  }
};
