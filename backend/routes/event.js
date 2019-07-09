const express = require("express");
const router = express.Router();

const eventController = require("../controllers/event");
const checkAuth = require("../middlewares/check-auth")

router.get("/", eventController.getEventList);

router.post("/", checkAuth, eventController.postEvent);

router.get("/:eventId", checkAuth, eventController.getEvent);

router.patch("/:eventId", checkAuth, eventController.updateEvent);

router.delete("/:eventId", checkAuth, eventController.deleteEvent);

module.exports = router;
