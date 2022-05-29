const { create } = require("../controllers/cusTicket.js")

const router = require("express").Router();

router.post("/create", create);

module.exports = router;
