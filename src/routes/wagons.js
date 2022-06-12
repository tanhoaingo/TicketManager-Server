const {
    create,
} = require("../controllers/wagons");
const router = require("express").Router();

router.post("/create", create);

// router.get("/:id", getById);

// router.get("/", getAll);

// router.put("/:id", update);

// router.delete("/:id", deleteById);

module.exports = router;