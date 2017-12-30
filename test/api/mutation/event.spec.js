const test = require('../../util/test');

describe('Events mutation API', () => {
  it('should create event if data is correct', () => {
    return test.api.mutation.create(`mutation {
      createEvent (input: {
        title: "test_event"
        dateStart: "${new Date().toISOString()}"
        dateEnd: "${new Date(new Date() + 30 * 24 * 60 * 60 * 1000).toISOString()}"
      }, usersIds: [1, 2], roomId: 1) {
        id
      }
    }`, 'createEvent', 'Event', true);
  });

  it('should not create event if data is incorrect', () => {
    return test.api.mutation.create(`mutation {
      createEvent (input: {
        title: "test_event"
        dateStart: "${new Date().toISOString()}"
        dateEnd: "${new Date(new Date() + 30 * 24 * 60 * 60 * 1000).toISOString()}"
      }, usersIds: [1, 2]) {
        id
      }
    }`, 'createEvent', 'Event', false);
  });

  it('should update event if such event exists and data is correct', () => {
    return test.api.mutation.update(`mutation {
      updateEvent (id: 4, input: {
        title: "test_event2"
      }) {
        id
      }
    }`, 'updateEvent', 'Event', true, {
      title: 'test_event2'
    });
  });

  it('should not update event if such event does not exist', () => {
    return test.api.mutation.update(`mutation {
      updateEvent (id: 28, input: {
        title: "test_event2"
      }) {
        id
      }
    }`, 'updateEvent', 'Event', false);
  });

  it('should not update event if data is incorrect', () => {
    return test.api.mutation.update(`mutation {
      updateEvent (id: 28, input: {
        title: 1123
      }) {
        id
      }
    }`, 'updateEvent', 'Event', false);
  });

  it('should add user to event if such user and event exist', () => {
    return test.api.mutation.update(`mutation {
      addUserToEvent (id: 4, userId: 3) {
        id
      }
    }`, 'addUserToEvent', 'Event', true, {
      Users: {
        id: 3
      }
    }, { model: 'User', action: 'ADD' });
  });

  it('should not add user to event if such event does not exist', () => {
    return test.api.mutation.update(`mutation {
      addUserToEvent (id: 28, userId: 3) {
        id
      }
    }`, 'addUserToEvent', 'Event', false);
  });

  it('should not add user to event if such user does not exist', () => {
    return test.api.mutation.update(`mutation {
      addUserToEvent (id: 4, userId: 28) {
        id
      }
    }`, 'addUserToEvent', 'Event', false);
  });

  it('should remove user from event if such user and event exist and user is listed in event', () => {
    return test.api.mutation.update(`mutation {
      removeUserFromEvent (id: 4, userId: 3) {
        id
      }
    }`, 'removeUserFromEvent', 'Event', true, {
      Users: {
        id: 3
      }
    }, { model: 'User', action: 'DELETE' });
  });

  it('should not remove user from event if such event does not exist', () => {
    return test.api.mutation.update(`mutation {
      removeUserFromEvent (id: 28, userId: 3) {
        id
      }
    }`, 'removeUserFromEvent', 'Event', false);
  });

  it('should not remove user from event if such user does not exist', () => {
    return test.api.mutation.update(`mutation {
      removeUserFromEvent (id: 4, userId: 28) {
        id
      }
    }`, 'removeUserFromEvent', 'Event', false);
  });

  it('should not remove user from event if user is not listed in event', () => {
    return test.api.mutation.update(`mutation {
      removeUserFromEvent (id: 4, userId: 3) {
        id
      }
    }`, 'removeUserFromEvent', 'Event', false);
  });

  it('should change event room if such room and event exist', () => {
    return test.api.mutation.update(`mutation {
      changeEventRoom (id: 4, roomId: 2) {
        id
      }
    }`, 'changeEventRoom', 'Event', true, {
      RoomId: 2
    });
  });

  it('should not change event room if such event does not exist', () => {
    return test.api.mutation.update(`mutation {
      changeEventRoom (id: 28, roomId: 2) {
        id
      }
    }`, 'changeEventRoom', 'Event', false);
  });

  it('should not change event room if such room does not exist', () => {
    return test.api.mutation.update(`mutation {
      changeEventRoom (id: 4, roomId: 28) {
        id
      }
    }`, 'changeEventRoom', 'Event', false);
  });

  it('should remove event if such event exists', () => {
    return test.api.mutation.remove(`mutation {
      removeEvent (id: 4) {
        id
      }
    }`, 'removeEvent', 'Event', true);
  });

  it('should not remove event if such event does not exist', () => {
    return test.api.mutation.remove(`mutation {
      removeEvent (id: 4) {
        id
      }
    }`, 'removeEvent', 'Event', false);
  });
});
