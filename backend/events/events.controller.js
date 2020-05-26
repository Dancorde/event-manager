const Event = require("./events.model");

exports.getEvents = async (req, res, next) => {
  await Event.find({ creator: req.userData.userId })
    .select("_id description startTime endTime")
    .then((events) => {
      const response = {
        message: "Events fetched successfully",
        events: events,
      };
      res.status(200).json(response);
    });
};

exports.postEvent = (req, res, next) => {
  const event = new Event({
    description: req.body.description,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    creator: req.userData.userId,
  });

  Event.find({
    endTime: { $gte: event.startTime },
    startTime: { $lte: event.endTime },
  }).then((events) => {
    if (events.length > 0) {
      res.status(409).json({
        message:
          "Can't create event. The event overlays another one!",
      });
    } else {
      event.save().then((result) => {
        res.status(201).json({
          message: "Event created",
          eventId: result._id,
        });
      });
    }
  });
};

exports.getEvent = (req, res, next) => {
  const id = req.params.eventId;

  Event.findById(id)
    .select("_id description startTime endTime")
    .then((event) => {
      if (event) {
        res.status(200).json(event);
      } else {
        res.status(404).json({
          message: "Event not found",
        });
      }
    });
};

exports.updateEvent = (req, res, next) => {
  const id = req.params.eventId;

  Event.find({
    $and: [
      { _id: { $ne: id } },
      { creator: { $eq: req.userData.userId } },
      {
        endTime: { $gte: req.body.startTime },
        startTime: { $lte: req.body.endTime },
      },
    ],
  }).then((events) => {
    if (events.length > 0) {
      res.status(409).json({
        message:
          "Can't update event. The event overlays another one!",
      });
    } else {
      Event.updateOne(
        { _id: id, creator: req.userData.userId },
        {
          $set: {
            description: req.body.description,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            creator: req.userData.userId,
          },
        }
      ).then((result) => {
        res.status(200).json({
          message: "Event updated successfully!",
        });
      });
    }
  });
};

exports.deleteEvent = (req, res, next) => {
  const id = req.params.eventId;

  Event.deleteOne({ _id: id, creator: req.userData.userId }).then(
    (result) => {
      if (result.deletedCount) {
        res.status(200).json({
          message: "Event deleted!",
        });
      } else {
        res.status(404).json({
          message: "Event not found!",
        });
      }
    }
  );
};
