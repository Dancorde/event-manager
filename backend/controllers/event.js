const mongoose = require('mongoose');

const Event = require('../models/event');

exports.getEventList = (req, res, next) => {
  Event.find()
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
        error: err
      });
    });
}

exports.postEvent = (req, res, next) => {
  const event = new Event({
    _id: new mongoose.Types.ObjectId(),
    description: req.body.description,
    startTime: req.body.startTime,
    endTime: req.body.endTime
  });

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
        error: err
      });
      console.log(err);
    });
}

exports.getEvent = (req, res, next) => {

}

exports.updateEvent = (req, res, next) => {

}

exports.deleteEvent = (req, res, next) => {
  const id = req.params.eventId;

  Event.deleteOne({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Event deleted!"
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
      console.log(err);
    });
}
