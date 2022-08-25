const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const connexion = require("../database");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const username = req.body.username;
  const firstname = req.body.firstName;
  const email = req.body.email;
  const password = req.body.password;
  const hash = await bcrypt.hash(password, 10);
  console.log("hash", hash);
  connexion.query("SELECT * FROM users;", username, (err, results) => {
    if (err) {
      //console.log(err)
      res.status(404).json({
        message: "Error",
        data: err,
      });
      return;
    }

    connexion.query(
      "INSERT INTO users (id,username,firstname,email, hash) VALUES (?,?,?,?,?);",
      [results.length, username, firstname, email, hash],
      (err, user) => {
        if (err) {
          res.status(404).json({
            message: "Error",
            data: err,
          });
          return;
        }
        res.status(200).json({
          message: "succes",
          data: user,
        });
      }
    );
  });
});

router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  connexion.query(
    "SELECT * FROM users WHERE username = ?",
    username,
    (error, results) => {
      if (results.length > 0) {
        bcrypt.compare(password, results[0].hash, function (err, result) {
          if (err) return res.status(500).send({ message: "Error server" });
          if (!result) {
            return res.status(404).json({
              loggedIn: false,
              message: "Invalid Password",
            });
          } else
            return res.status(200).json({
              loggedIn: true,
              message: "Login Successful",
            });
        });
      } else {
        return res
          .status(404)
          .send({ loggedIn: false, message: "User doesn't exist", error });
      }
    }
  );
});

exports.desactivateAccount = (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE users   WHERE id = ?`;

  connexion.query(sql, id, (err, results) => {
    if (err) {
      return res.status(404).json({ err });
    }
    res.localStorage.clear("token");
    res.status(200).json("DESACTIVATE");
  });
};
module.exports = router;
