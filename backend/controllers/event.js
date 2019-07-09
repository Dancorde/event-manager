const mongoose = require('mongoose');

const Event = require('../models/event');

exports.getEventList = (req, res, next) => {
  Event.find({creator: req.userData.userId})
    .select('_id description startTime endTime')
    .exec()
    .then(events => {
      const response = {
        message: 'Events fetched successfully',
        events: events
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "Fetching events failed!"
      });
    });
}

exports.postEvent = (req, res, next) => {
  const event = new Event({
    _id: new mongoose.Types.ObjectId(),
    description: req.body.description,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    creator: req.userData.userId
  });

  Event.find({ startTime: { $gte: event.startTime }, endTime: { $lte: event.startTime } })
    .then(events => {
      if (events.length > 0) {
        res.status(500).json({
          message: "Can't create event. The event overlays another one!"
        });
      } else {
        event.save()
          .then(result => {
            res.status(201).json({
              message: 'Event created',
              eventId: result._id
            });
            console.log(result);
          })
          .catch(err => {
            res.status(500).json({
              message: "Creating an event failed!"
            });
            console.log(err);
          });
      }
    })


}

exports.getEvent = (req, res, next) => {
  const id = req.params.eventId;

  Event.findById(id)
    .select('_id description startTime endTime')
    .exec()
    .then(event => {
      if (event) {
        res.status(200).json(event);
      } else {
        res.status(404).json({
          message: 'Event not found'
        });
      }
      console.log(event);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "Fetching event failed!"
      });
    });
}

exports.updateEvent = (req, res, next) => {
  const id = req.params.eventId;

  Event.updateOne({ _id: id, creator: req.userData.userId }, {
    $set: {
      description: req.body.description,
      startTime: req.body.startTime,
      endTime: req.body.endTime
    }
  })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Event updated successfully!"
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Couldn't update event!"
      });
      console.log(err);
    });
}

exports.deleteEvent = (req, res, next) => {
  const id = req.params.eventId;

  Event.deleteOne({ _id: id, creator: req.userData.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Event deleted!"
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Fetching event failed!"
      });
      console.log(err);
    });
}
