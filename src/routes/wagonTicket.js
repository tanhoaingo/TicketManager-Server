const { create, getAll, getAllByIdTrip, getSeatInWagon } = require("../controllers/wagonTicket.js")

const router = require("express").Router();

router.post("/create", create);

router.get("/", getAll);

router.post("/getAllByIdTrip", getAllByIdTrip);

router.post("/getSeatInWagon", getSeatInWagon);

module.exports = router;
