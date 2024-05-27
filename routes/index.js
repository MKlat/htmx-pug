var express = require("express");
var router = express.Router();

router.get("/", (req, res, next) => {
  res.render("index", { title: "Zeltlager FELB Cloppeburg" });
});

router.get("/info", (req, res, next) => {
  res.render("info", { title: "Informationen"});
});

router.get("/impressum", (req, res, next) => {
  res.render("impressum", { title: "Impressum"});
});

module.exports = router;
