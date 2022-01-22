import { DateTime } from 'luxon';

// Returns the start and end of the day on date
// If date is null, then it returns start and end of today
// timeFrame: how many days the start to end interval should contain (7 means a week)
// daysBack: how many days back from current day the end should be (0 means end is end of date)
/* eslint-disable import/prefer-default-export */
export const getStartEndDate = (date, timeFrame = 1, daysBack = 0) => {
  if (!date) {
    // this will always be the current date in eastern
    const start = DateTime.now().setZone('America/New_York').startOf('day').minus({ days: timeFrame - 1 + daysBack })
      .toISO();
    const end = DateTime.now().setZone('America/New_York').endOf('day').minus({ days: daysBack })
      .toISO();
    return { start, end };
  } else {
    // to stop weird behavior where + in ISO date is replaced with a space
    const newDate = date.replace(' ', '+');
    // this will always be the date that the ISO date is in, but IN EASTERN
    // so if ISO date is 3am UTC on the 22nd, then this range will be the 21st!
    // but this is what we want because then the frontend can just pass current UTC date,
    // and this returns "yesterday's" quiz if its still yesterday in new york
    const start = DateTime.fromISO(newDate).setZone('America/New_York').startOf('day').minus({ days: timeFrame - 1 + daysBack })
      .toISO();
    const end = DateTime.fromISO(newDate).setZone('America/New_York').endOf('day').minus({ days: daysBack })
      .toISO();
    return { start, end };
  }
};
