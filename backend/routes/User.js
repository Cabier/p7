const express = require("express");
const router = express.Router();

const connexion = require("../database");

router.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
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
      "INSERT INTO users (id,username, password) VALUES (?,?,?);",
      [results.length, username, password],
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
    (err, results) => {
      if (err) {
        res.status(404).json({
          message: "Error",
          data: err,
        });
      }
      if (results.length > 0) {
        
        if (password == results[0].password) {
          res.json({ loggedIn: true, username: username });
        } else {
          res.json({
            loggedIn: false,
            message: "Wrong username/password combo!",
          });
        }
      } else {
        res.json({ loggedIn: false, message: "User doesn't exist" });
      }
    }
  );
});

module.exports = router;
