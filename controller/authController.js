import { db } from "../db/db.js";
import {
  comparePassword,
  hashPassword,
  showError,
} from "../helper/authHelper.js";
import JWT from "jsonwebtoken";

export const getUsersController = async (req, res) => {
  try {
    const { count, page } = req.body;
    db.query(
      "SELECT * FROM users ORDER BY id LIMIT ? OFFSET ?",
      [count, page],
      (error, result) => {
        if (error) showError(res, error);
        res.status(201).send({ success: true, message: "All users", result });
      }
    );
  } catch (error) {
    showError(res, error);
  }
};

export const signUpController = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username) {
      return res.send({ message: "Username is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    const hashedPassword = await hashPassword(password);
    // checking for exixting user
    db.query(
      "SELECT username FROM users WHERE email = ?",
      [email],
      (error, result) => {
        if (error) showError(res, error);
        else {
          if (result.length) {
            res
              .status(201)
              .send({ success: true, message: "Users already exist" });
          } else {
            db.query(
              "INSERT INTO `users` (`id`, `username`, `email`, `password`,`role`) VALUES (NULL, ?, ?, ?,0);",
              [username, email, hashedPassword],
              (error, result) => {
                if (error) showError(res, error);
                else {
                  res.status(200).send({
                    success: true,
                    message: "Account Successfully Created",
                    id: result.insertId,
                  });
                }
              }
            );
          }
        }
      }
    );
  } catch (error) {
    showError(res, error);
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (error, result) => {
        if (error) showError(res, error);
        if (result.length === 1) {
          const hashedPassword = result[0].password;
          const matched = await comparePassword(password, hashedPassword);
          if (matched) {
            const token = JWT.sign(
              { id: result[0].id },
              process.env.JWT_SECRET,
              {
                expiresIn: "7d",
              }
            );
            return res.status(200).send({
              success: true,
              message: "Login Succesfully",
              user: {
                id: result[0].id,
                username: result[0].username,
                email: result[0].email,
              },
              token,
            });
          } else {
            showError(res, error, "Invalid Credentials", 401);
          }
        } else {
          showError(res, error, "User Not Found", 404);
        }
      }
    );
  } catch (error) {
    showError(res, error);
  }
};
