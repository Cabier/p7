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
      [results.length + 2, title, description, imageTitre, author],
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
  console.log("userName",userName)
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
router.get('/like/:id', (req, res) => {

  const {id} = req.params;

  const sqlSelect = `SELECT * FROM likes WHERE likes.post_Id = ${id}`;

  connexion.query(sqlSelect, (err, results) => {
    if (err) {
       console.log(err);
       res.status(404).json({ err });
       throw err;
    }

    return res.status(200).json({ likes: results.length })
  });
  
})
router.patch("/like", (req, res) => {
  const {  postId,userLiking } = req.body;
  console.log("reqbody",req.body)
  const sqlSelect = `SELECT post_Id ,userLiking FROM likes WHERE likes.post_Id = ${postId} AND likes.userLiking= '${userLiking}'`;
  connexion.query(sqlSelect, (err, result) => {
    if (err) {
      console.log(err);
      res.status(404).json({ err });
      throw err;
    }
    
    
    if (result.length === 0) {
      const sqlInsert = `INSERT INTO likes ( post_Id,userLiking) VALUES ('${postId}', "${userLiking}")`;
      console.log(sqlInsert)
      connexion.query(sqlInsert, (err, result) => {
        if (err) {
          console.log(err);
          res.status(404).json({ err });
          throw err;
        }
        res.status(200).json(result);
        console.log(res)
      });
      //c'est ici que je dois ajouter le like refaire un patch avec like
    } else {
      const sqlDelete = `DELETE FROM likes WHERE likes.post_Id = ${postId} AND  likes.userLiking = "${userLiking}"`;
      console.log("sqlDelete",sqlDelete)
      connexion.query(sqlDelete, (err, result) => {
        if (err) {
          console.log(err);
          res.status(404).json(err);
          throw err;
        }
        res.status(200).json(result);
      });
    }
  });
})

router.post("/like", (req, res) => {
  const { userLiking } = req.body;
  const sqlInsert = `SELECT COUNT(*) AS total FROM likes WHERE likes.post_Id = ${post_Id }`;
  console.log("insert",sqlInsert)
  connexion.query(sqlInsert, (err, result) => {
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
    res.status(200).json(result);
  });
});


  

module.exports = router;
