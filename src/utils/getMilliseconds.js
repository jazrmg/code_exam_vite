export const getMilliseconds = (value, unit) => {
  switch (unit) {
    case "seconds":
      return value * 1000;
    case "minutes":
      return value * 60 * 1000;
    case "hours":
      return value * 60 * 60 * 1000;
    default:
      return 0;
  }
};
