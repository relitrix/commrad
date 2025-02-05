module.exports = function truncateString(str, num, end = "...") {
    if (!str) {
        return str;
    }
    if (str.length > num - end.length) {
      return str.slice(0, num - end.length) + end;
    } else {
      return str;
    }
  }