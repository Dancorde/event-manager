const express = require("express");
const router = express.Router();

const eventController = require("../controllers/event");

router.get("/", eventController.getEventList);

router.post("/", eventController.postEvent);

router.get("/:eventId", eventController.getEvent);

router.patch("/:eventId", eventController.updateEvent);

router.delete("/:eventId", eventController.deleteEvent);

module.exports = router;
