const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/upload");
  },
  filename: (req, file, cb) => {
  const safeName = file.originalname.replace(/\s+/g, "_");
  cb(null, Date.now() + "-" + safeName);
}

});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only images allowed"));
  }
};

const uploadImg = multer({
  storage,
  fileFilter
}).array("images", 6);

module.exports = uploadImg;
