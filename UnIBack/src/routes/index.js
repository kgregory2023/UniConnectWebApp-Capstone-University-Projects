const express = require('express');
const router = express.Router();
const userRoutes = require("./usersRoutes");
const locationRoutes = require("./locationsRoutes");
const commentRoutes = require("./commentsRoutes");
const ratingRoutes = require("./ratingsRoutes");

router.use("/users", userRoutes);
router.use("/locations", locationRoutes);
router.use("/comments", commentRoutes);
router.use("/ratings", ratingRoutes);

module.exports = router;