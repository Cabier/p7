const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const connexion = require("../database");
const jwt = require('jsonwebtoken');
const {validateToken} = require('../middleware/Auth')

router.post("/register", async (req, res) => {
 
  const username = req.body.username;
  const firstname = req.body.firstName;
  const email = req.body.email;
  const password = req.body.password;
  const hash= await bcrypt.hash(password,10)
  
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

router.post("/login",(req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const accessToken = jwt.sign({username},"importante secret");
 // res.json(accessToken);
  console.log("token",accessToken)
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
          res.json({ loggedIn: true, username: username ,token : accessToken});

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
exports.desactivateAccount = (req, res) => {
  const userId = req.params.id;
  const sql = `UPDATE users u SET active=0 WHERE u.user_id = ?`;
  const db = dbc.getDB();
  db.query(sql, userId, (err, results) => {
    if (err) {
      return res.status(404).json({ err });
    }
    res.localStorage.clear("jwt");
    res.status(200).json("DESACTIVATE");
  });
};
module.exports = router;
