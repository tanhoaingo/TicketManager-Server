const {
  create,
  getById,
  getAll,
  update,
  deleteById,
  getInforbyID,
} = require("../controllers/route");
const router = require("express").Router();

router.post("/create", create);

router.get("/:id", getById);

router.get("/", getAll);

router.put("/:id", update);

router.delete("/:id", deleteById);

router.get("/:id/informations", getInforbyID);

module.exports = router;
