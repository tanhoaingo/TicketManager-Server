const { create } = require("../controllers/seat.js")

const router = require("express").Router();

router.post("/create", create);

module.exports = router;
