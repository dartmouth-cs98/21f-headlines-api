import { DateTime } from 'luxon';

// Returns the start and end of the day on date
// If date is null, then it returns start and end of today
// timeFrame: how many days the start to end interval should contain (7 means a week)
// daysBack: how many days back from current day the end should be (0 means end is end of date)
/* eslint-disable import/prefer-default-export */
export const getStartEndDate = (date, timeFrame = 1, daysBack = 0) => {
  if (!date) {
    const start = DateTime.now().setZone('America/New_York').startOf('day').minus({ days: timeFrame - 1 + daysBack })
      .toISO();
    const end = DateTime.now().setZone('America/New_York').endOf('day').minus({ days: daysBack })
      .toISO();
    return { start, end };
  } else {
    const start = DateTime.fromFormat(date, 'y-M-d').setZone('America/New_York').startOf('day').minus({ days: timeFrame - 1 + daysBack })
      .toISO();
    const end = DateTime.fromFormat(date, 'y-M-d').setZone('America/New_York').endOf('day').minus({ days: daysBack })
      .toISO();
    return { start, end };
  }
};
