import slugify from "slugify";
import { db } from "../db/db.js";
import { getCurrentdate, showError } from "../helper/authHelper.js";

export const createBookController = async (req, res) => {
  try {
    const { title, author } = req.body;
    if (!title) {
      return res.send({ message: "Title is Required" });
    }
    if (!author) {
      return res.send({ message: "Author is Required" });
    }

    db.query(
      "INSERT INTO `books` (`book_id`, `title`, `author`,`slug`) VALUES (NULL, ?, ?,?);",
      [title, author, slugify(title)],
      (error, result) => {
        if (error) showError(res, error);
        else {
          res.status(200).send({
            success: true,
            message: "Book Created Succesfully",
            book_id: result.insertId,
          });
        }
      }
    );
  } catch (error) {
    showError(res, error);
  }
};

export const getBooksController = async (req, res) => {
  try {
    const { page, count } = req.body;
    const skip = (page - 1) * count;
    db.query(
      "SELECT * FROM books ORDER BY book_id LIMIT ? OFFSET ?",
      [count, skip],
      (error, result) => {
        if (error) showError(res, error);
        res.status(201).send({ success: true, message: "All users", result });
      }
    );
  } catch (error) {
    showError(res, error);
  }
};

export const searchBookController = async (req, res) => {
  try {
    const title = req.params.slug;
    if (!title) {
      return res.send({ message: "Title is Required" });
    }
    const slug = "%" + title + "%";
    db.query(
      "SELECT * FROM books WHERE slug LIKE ? ",
      [slug],
      (error, result) => {
        if (error) showError(res, error);
        res.status(200).send(result);
      }
    );
  } catch (error) {
    showError(res, error);
  }
};

export const borrowBookController = async (req, res) => {
  try {
    const { book_id, user_id, issue_time, return_time } = req.body;
    if (!book_id) {
      return res.send({ message: "Book-Id is Required" });
    }
    if (!user_id) {
      return res.send({ message: "User-Id is Required" });
    }
    if (!issue_time) {
      return res.send({ message: "Issue Time is Required" });
    }
    if (!return_time) {
      return res.send({ message: "Return Time is Required" });
    }

    const q =
      "SELECT issue_time, return_time FROM logbooks WHERE (book_id = ? AND ? between issue_time AND return_time ) OR(book_id = ? AND ? between issue_time AND return_time)";
    db.query(
      q,
      [book_id, issue_time, book_id, return_time],
      (error, result) => {
        if (error) showError(res, error);
        if (result.length === 0) {
          db.query(
            "INSERT INTO `logbooks` (`log_id`, `book_id`, `issue_time`, `return_time`, `user_id`) VALUES (NULL, ?, ?, ?, ?);",
            [book_id, issue_time, return_time, user_id],
            (error, result) => {
              if (error) showError(res, error);
              return res.status(200).send({
                success: true,
                message: "Book Booked Successfully",
                book_id,
              });
            }
          );
        } else {
          return res.status(400).send({
            success: false,
            message: "Book is not available at this moment",
          });
        }
      }
    );
  } catch (error) {
    showError(res, error);
  }
};

export const availabilityController = async (req, res) => {
  try {
    const { date, book_id } = req.body;

    if (!book_id) {
      return res.send({ message: "Book Id is Required" });
    }
    if (!date) {
      return res.send({ message: "Date is Required" });
    }
    db.query(
      "SELECT issue_time, return_time FROM logbooks WHERE book_id = ? AND ? between issue_time AND return_time",
      [book_id, date],
      (error, result) => {
        if (error) showError(res, error);

        if (result.length === 0) {
          return res.status(200).send({
            success: true,
            message: "Book is Available",
            book_id,
            available: true,
          });
        } else {
          return res.status(400).send({
            success: false,
            message: "Book is not available at this moment",
            available_at: result[0].return_time,
          });
        }
      }
    );
  } catch (error) {
    showError(res, error);
  }
};
