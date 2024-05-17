const express = require("express");
const { storeCat, getAllCategory, deleteCategory } = require("../controller/Categories");
const { substore, getallsubcat, deletesubcat } = require("../controller/SubCategory");

const upload = require('../multerconfg')

const router = express.Router()




router.post("/category", storeCat)
router.get("/category", getAllCategory)

router.post("/subcategory", upload.single("image"), substore);
router.get("/subcategory", getallsubcat)
router.delete("/deletecategory/:id", deleteCategory)


router.delete("/deletesubcategory/:id", deletesubcat)



module.exports = router






