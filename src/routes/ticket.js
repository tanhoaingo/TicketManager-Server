const { create } = require("../controllers/ticket.js")

const router = require("express").Router();

router.post("/create", create);

module.exports = router;
