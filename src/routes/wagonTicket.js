const { create } = require("../controllers/wagonTicket.js")

const router = require("express").Router();

router.post("/create", create);

module.exports = router;
