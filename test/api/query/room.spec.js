const test = require('../../util/test');

describe('Rooms query API', () => {
  it('should give all rooms', () => {
    return test.api.query(`{
      rooms {
        id
        title
        capacity
        floor
      }
    }`, 'rooms', 'Room', true);
  });

  it('should give room by correct id', () => {
    return test.api.query(`{
      room(id: 1) {
        id
        title
        capacity
        floor
      }
    }`, 'room', 'Room', true, 1);
  });

  it('should give null on incorrect id', () => {
    return test.api.query(`{
      room(id: "sad") {
        id
        title
        capacity
        floor
      }
    }`, 'room', 'Room', false);
  });
});
