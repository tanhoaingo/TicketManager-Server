const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/../uploads`);
  },
  filename: (req, file, cb) => {
    let lastIndex = file.originalname.lastIndexOf(".");
    let ext = file.originalname.substring(lastIndex);
    cb(null, `img-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

module.exports = upload;
