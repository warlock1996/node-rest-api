const express = require("express");

const router = express.Router();

router.get("/friends", (req, res, next) => {
  res.json({
    friends: ["Ali Raza", "Usman Ahmed", "Jamal Sabir", "Arslan Ali"],
  });
});

module.exports = router;
