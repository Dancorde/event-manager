module.exports = {
  normalizePort: (val) => {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
      return val;
    }

    if (port >= 0) {
      return port;
    }

    return false;
  },
  parseDate: (value) => {
    value = value.split("T");
    let date = value[0].split("-");
    let time = value[1].split(".")[0].split(":");

    date = {
      day: date[2],
      month: date[1],
      year: date[0],
    };

    time = {
      hour: time[0],
      minute: time[1],
      second: time[2],
    };

    return { date, time };
  },
};
