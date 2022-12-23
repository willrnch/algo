const toMin = (time) => {
  const [h, m] = time.split(':');
  return parseInt(h, 10) * 60 + parseInt(m, 10);
};

const overlap = (a, b) => {
  if (a[0] <= b[0]) {
    return a[1] >= b[0];
  }
  return b[1] >= a[0];
};

const union = (a, b) => [Math.min(a[0], b[0]), Math.max(a[1], b[1])];

const parseInterval = (interval) => interval.map((it) => toMin(it));
const parseCalendar = (calendar) => calendar.map((it) => parseInterval(it));

const mergeCalendars = (a, b) => {
  const out = [];
  let ia = 0;
  let ib = 0;
  let iOut = -1;
  while (true) {
    const itA = ia < a.length ? a[ia] : null;
    const itB = ib < b.length ? b[ib] : null;

    let it;
    if (!itB) {
      it = itA;
      ++ia;
    } else if (!itB) {
      it = itB;
      ++ib;
    } else {
      if (itA[0] < itB[0]) {
        it = itA;
        ++ia;
      } else {
        it = itB;
        ++ib;
      }
    }

    if (!it) {
      break;
    }

    if (iOut === -1) {
      out.push(it);
      ++iOut;
    } else {
      if (overlap(out[iOut], it)) {
        out[iOut] = union(out[iOut], it);
      } else {
        out.push(it);
        ++iOut;
      }
    }
  }
  return out;
};

const formatTime = (interval) => {
  const m = interval % 60;
  return `${Math.floor(interval / 60)}:${(m < 10) ? `0${m}` : m}`;
};
const formatInterval = (interval) => interval.map(formatTime);

const formatCalendar = (calendar) => calendar.map(formatInterval);

const applyBounds = (calendar, bounds) => {
  const [start, end] = bounds;

  let h = 0;
  while (h < calendar.length) {
    const it = calendar[h];
    if (it[0] >= start) {
      break;
    }

    if (it[1] <= start) {
      ++h;
    } else {
      it[0] = start;
      break;
    }
  }
  calendar.splice(0, h);

  let l = calendar.length - 1;
  while (l >= 0) {
    const it = calendar[l];
    if (it[1] <= end) {
      break;
    }

    if (it[0] >= end) {
      --l;
    } else {
      console.log(end);
      it[1] = end;
      break;
    }
  }
  calendar.splice(l + 1, calendar.length - l - 1);
};


const getFreeSlots = (calendar) => {
  const slots = [];
  const end = calendar.length - 1;
  for (let i = 0; i < end; ++i) {
    const current = calendar[i];
    const next = calendar[i + 1];
    slots.push([current[1], next[0]]);
  }
  return slots;
};

function calendarMatching(calendar1, dailyBounds1, calendar2, dailyBounds2, meetingDuration) {
  calendar1 = parseCalendar(calendar1);
  dailyBounds1 = parseInterval(dailyBounds1);
  calendar2 = parseCalendar(calendar2);
  dailyBounds2 = parseInterval(dailyBounds2);

  const start = (dailyBounds1[0] >= dailyBounds2[0]) ? dailyBounds1[0] : dailyBounds2[0];
  const end = (dailyBounds1[1] <= dailyBounds2[1]) ? dailyBounds1[1] : dailyBounds2[1];
  const unifiedCalendar = mergeCalendars(calendar1, calendar2);;

  applyBounds(unifiedCalendar, [start, end]);
  if (!unifiedCalendar.length) {
    return formatCalendar([[start, end]]);
  }

  let freeSlots = getFreeSlots(unifiedCalendar);

  const first = unifiedCalendar[0];
  if (first[0] > start) {
    freeSlots.unshift([start, first[0]]);
  }

  const last = unifiedCalendar[unifiedCalendar.length - 1];
  if (last[1] < end) {
    freeSlots.push([last[1], end]);
  }

  freeSlots = freeSlots.filter((it) => it[1] - it[0] >= meetingDuration);

  return formatCalendar(freeSlots);
}


exports.calendarMatching = calendarMatching;

