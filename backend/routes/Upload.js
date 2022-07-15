const express = require("express");
const router = express.Router();

const connexion = require("../database");
const path = require("path");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/uploads");
  },
  filename: (req, file, cb) => {
    const filename = file.originalname.trim();
    cb(null, filename);
  },
});

var upload = multer({ storage: storage });

router.post("/", upload.single("image"), (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const imageTitre = req.body.imageTitre;
  const author = req.body.author;

  connexion.query("SELECT * FROM uploads;", title, (err, results) => {
    if (err) {
      //console.log(err)
      res.status(404).json({
        message: "Error",
        data: err,
      });
      return;
    }

    connexion.query(
      "INSERT INTO uploads (id, title, description, image, author) VALUES ( ?, ? , ? , ?, ?);",
      [results.length + 1, title, description, imageTitre, author],
      (err, result) => {
        if (err) {
          res.status(404).json({
            message: "Error",
            data: err,
          });
          return;
        }
        res.status(200).json({
          message: "succes",
          data: result,
        });
      }
    );
  });
});

router.get("/Images", function (req, res, next) {
  var options = {
    root: path.resolve(process.cwd() + "/images/uploads/"),
  };
  var fileName = req.query.nameImg;
  res.status(200).sendFile(fileName, options, function (err) {
    if (err) next(err);
  });
});

router.get("/", (req, res) => {
  connexion.query("SELECT * FROM uploads", (err, results) => {
    if (err) {
      console.log(err);
    }
    res.send(results);
  });
});

router.get("/byUser/:username", (req, res) => {
  const userName = req.params.username;
  connexion.query(
    "SELECT * FROM uploads WHERE author = ?;",
    userName,
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send(results);
    }
  );
});

router.post("/like", (req, res) => {
  const userLiking = req.body.userLiking;
  const postId = req.body.postId;

  connexion.query(
    "INSERT INTO Likes (userLiking, postId) VALUES (?,?)",
    [userLiking, postId],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      connexion.query(
        "UPDATE uploads SET likes = likes + 1 WHERE id = ?",
        postId,
        (err2, results2) => {
          res.send(results);
        }
      );
    }
  );
});

module.exports = router;
