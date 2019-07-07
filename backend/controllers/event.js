

exports.getEventList = (req, res, next) => {
  const events = [
    {
      id: "1",
      description: "first event",
      startTime: "2019-07-07",
      endTime: "2019-07-07"
    },
    {
      id: "2",
      description: "second event",
      startTime: "2019-07-08",
      endTime: "2019-07-08"
    }
  ];

  res.status(200).json({
    events: events
  });
}

exports.postEvent = (req, res, next) => {

}

exports.getEvent = (req, res, next) => {

}

exports.updateEvent = (req, res, next) => {

}

exports.deleteEvent = (req, res, next) => {

}
