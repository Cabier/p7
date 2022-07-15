const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "post_image") cb(null, "./images/posts/");
    else if (file.fieldname === "profil_image") cb(null, "./images/profils/");
  },
  filename: (req, file, callback) => {
    //console.log("file", file)
        let name = file.originalname.replace(".png", "");
        name = name.replace(".jpg", "");
        name = name.replace(".jpeg", "");
        name = name.replace(".webp", "");
        console.log("Image name => => => => =>", name) 
    callback(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
