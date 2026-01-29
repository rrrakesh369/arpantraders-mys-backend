const express = require("express");
const router = express.Router();

const {
  createDashboard,
  getAllDashboard,
  getAllSolutions,
  createSolution,
  getSolutionsByProdType
} = require("../handlers");


const uploadImg = require("../utils/multerConfig");
router.post(
  "/dashboard",
  (req, res, next) => {
    uploadImg(req, res, function (err) {
      if (err) {
        console.error("MULTER ERROR:", err);
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  createDashboard
);

//getAllDashboard

router.get("/dashboard", getAllDashboard);


// Solutions routes
const uploadImg1 = require("../utils/multerConfig");
router.post(
  "/solution",
  (req, res, next) => {
    uploadImg1(req, res, function (err) {
      if (err) {
        console.error("MULTER ERROR:", err);
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  createSolution);


router.get("/solutions", getAllSolutions);

router.get("/solutions/type/:prodType",  getSolutionsByProdType);


module.exports = router;
