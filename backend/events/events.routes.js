const express = require("express");
const router = express.Router();

const checkAuth = require("../middlewares/check-auth");
const eventController = require("./events.controller");

router.get("/", checkAuth, eventController.getEvents);

router.post("/", checkAuth, eventController.postEvent);

router.get("/:eventId", checkAuth, eventController.getEvent);

router.patch("/:eventId", checkAuth, eventController.updateEvent);

router.delete("/:eventId", checkAuth, eventController.deleteEvent);

module.exports = router;
