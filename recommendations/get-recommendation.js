const moment = require('moment');

function getRecommendation (date, members, db, id) {
  let suitableRooms = [];
  let busyRooms = [];
  let smallRooms = [];
  for (let i = 0; i < db.rooms.length; ++i) {
    let free = true;
    for (let j = 0; j < db.rooms[i].events.length; ++j) {
      if (!id || db.rooms[i].events[j].id !== id) {
        if (moment(date.start).isBefore(moment(db.rooms[i].events[j].dateEnd), 'minute') && moment(date.end).isAfter(moment(db.rooms[i].events[j].dateStart), 'minute')) {
          if (db.rooms[i].hasOwnProperty('clashingEvents')) {
            db.rooms[i].clashingEvents.push(db.rooms[i].events[j]);
          } else db.rooms[i].clashingEvents = [db.rooms[i].events[j]];
          if (db.rooms[i].hasOwnProperty('maxMembers')) {
            if (db.rooms[i].maxMembers < db.rooms[i].events[j].Users.length) db.rooms[i].maxMembers = db.rooms[i].events[j].Users.length; // TODO: optimize by querying only count
          } else db.rooms[i].maxMembers = db.rooms[i].events[j].Users.length;
          if (!db.rooms[i].hasOwnProperty('clashingStart')) {
            db.rooms[i].clashingStart = db.rooms[i].events[j].dateStart;
          }
          db.rooms[i].clashingEnd = db.rooms[i].events[j].dateEnd;
          free = false;
        } else if (moment(date.end).isSameOrBefore(moment(db.rooms[i].events[j].dateStart), 'minute')) {
          db.rooms[i].firstInFuture = j;
          break;
        }
      }
    }
    if (free) {
      if (db.rooms[i].capacity >= members.length) {
        suitableRooms.push(db.rooms[i]);
      } else smallRooms.push(db.rooms[i]);
    } else if (db.rooms[i].capacity >= members.length) {
      busyRooms.push(db.rooms[i]);
    }
  }
  for (let i = 0; i < suitableRooms.length; ++i) {
    let distance = 0;
    for (let j = 0; j < members.length; ++j) {
      distance += Math.abs(members[j].homeFloor - suitableRooms[i].floor);
    }
    suitableRooms[i].distance = distance;
    suitableRooms[i].dateStart = date.start;
    suitableRooms[i].dateEnd = date.end;
  }
  suitableRooms.sort((a, b) => {
    if (a.distance < b.distance) return -1;
    else if (a.distance > b.distance) return 1;
    return 0;
  });
  if (suitableRooms.length) return suitableRooms;
  else {
    let alternativeRoom = null;
    let newRoom = null;
    for (let i = 0; i < busyRooms.length; ++i) {
      for (let j = 0; j < smallRooms.length; ++j) {
        if (busyRooms[i].maxMembers <= smallRooms[j].capacity) {
          let free = true;
          for (let k = 0; k < smallRooms[j].events.length; ++k) {
            if (moment(busyRooms[i].clashingStart).isBefore(moment(smallRooms[j].events[k].dateEnd), 'minute') && moment(date.end).isAfter(moment(smallRooms[j].events[k].dateStart), 'minute')) {
              free = false;
              break;
            }
          }
          if (free) {
            newRoom = smallRooms[j];
            break;
          }
        }
      }
      if (newRoom) {
        alternativeRoom = busyRooms[i];
        alternativeRoom.newRoom = newRoom;
        break;
      }
    }
    if (!alternativeRoom) {
      let newStart = null;
      for (let i = 0; i < busyRooms.length; ++i) {
        if (busyRooms[i].hasOwnProperty('firstInFuture')) {
          let toCompare = null;
          for (let j = (busyRooms[i].firstInFuture - 1 > 0 ? busyRooms[i].firstInFuture - 1 : 0); j < busyRooms[i].events.length - 1; ++j) {
            if (moment(busyRooms[i].events[j + 1].dateStart).startOf('minute').diff(moment(busyRooms[i].events[j].dateEnd).startOf('minute')) >= moment(date.end).startOf('minute').diff(moment(date.start).startOf('minute'))) {
              toCompare = busyRooms[i].events[j].dateEnd;
              break;
            }
          }
          if (!toCompare) toCompare = busyRooms[i].events[busyRooms[i].events.length - 1].dateEnd;
          if (!newStart || moment(newStart).isAfter(moment(toCompare), 'minute')) {
            newStart = toCompare;
            alternativeRoom = busyRooms[i];
          }
        } else {
          if (!newStart || moment(newStart).isAfter(moment(busyRooms[i].clashingEvents[busyRooms[i].clashingEvents.length - 1].dateEnd), 'minute')) {
            newStart = busyRooms[i].clashingEvents[busyRooms[i].clashingEvents.length - 1].dateEnd;
            alternativeRoom = busyRooms[i];
          }
        }
      }
      alternativeRoom.newStart = newStart;
      alternativeRoom.newEnd = moment(newStart).add(moment(date.end).startOf('minute').diff(moment(date.start).startOf('minute'), 'minute'), 'minutes').toDate();
    }
    return alternativeRoom;
  }
}

module.exports = getRecommendation;
