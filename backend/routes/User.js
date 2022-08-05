const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt")
const connexion = require("../database");

router.post("/register",async (req, res) => {
  const username = req.body.username;
  const firstName = req.body.firstName;
  const email = req.body.email;
  const password = req.body.password;
  const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const user = {
      ...req.body,
      user_password: encryptedPassword,
    };
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
      "INSERT INTO users (id,username,firstName,email, password) VALUES (?,?,?,?,?);",
      [results.length,username,firstName,email, password],
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
router.get("/logout", (req, res) => {
  //quand l'utilisateur se deconnecte le cookie qu'on lui a injecté on va lui retirer
  res.cookie("jwt", "", { maxAge: 1 }); // cookie va vite disparaitre 1 milliseconde
  res.status(200).json("OUT");
});
module.exports = router;
