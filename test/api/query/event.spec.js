const test = require('../../util/test');

let associations = {
  Users: {
    model: 'User',
    relation: 'belongsToMany',
    through: 'Events_Users'
  },
  Room: {
    model: 'Room',
    relation: 'belongsTo'
  }
};

describe('Events query API', () => {
  it('should give all events with associations', () => {
    return test.api.query(`{
      events {
        id
        title
        dateStart
        dateEnd
        users {
          id
          login
          homeFloor
          avatarUrl
        }
        room {
          id
          title
          capacity
          floor
        }
      }
    }`, 'events', 'Event', true, null, associations);
  });

  it('should give event with associations by correct id', () => {
    return test.api.query(`{
      event(id: 1) {
        id
        title
        dateStart
        dateEnd
        users {
          id
          login
          homeFloor
          avatarUrl
        }
        room {
          id
          title
          capacity
          floor
        }
      }
    }`, 'event', 'Event', true, 1, associations);
  });

  it('should give null on incorrect id', () => {
    return test.api.query(`{
      event(id: "sad") {
        id
        title
        dateStart
        dateEnd
        users {
          id
          login
          homeFloor
          avatarUrl
        }
        room {
          id
          title
          capacity
          floor
        }
      }
    }`, 'event', 'Event', false);
  });
});
