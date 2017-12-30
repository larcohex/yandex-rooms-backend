const test = require('../../util/test');

describe('Rooms mutation API', () => {
  it('should create room if data is correct', () => {
    return test.api.mutation.create(`mutation {
      createRoom (input: {
        title: "test_room"
        capacity: 4
        floor: 13
      }) {
        id
      }
    }`, 'createRoom', 'Room', true);
  });

  it('should not create room if data is incorrect', () => {
    return test.api.mutation.create(`mutation {
      createRoom (input: {
        capacity: 4
        floor: 13
      }) {
        id
      }
    }`, 'createRoom', 'Room', false);
  });

  it('should update room if such room exists and data is correct', () => {
    return test.api.mutation.update(`mutation {
      updateRoom (id: 6, input: {
        floor: 28
      }) {
        id
      }
    }`, 'updateRoom', 'Room', true, {
      floor: 28
    });
  });
  it('should not update room if such room does not exist', () => {
    return test.api.mutation.update(`mutation {
      updateRoom (id: 25, input: {
        floor: 28
      }) {
        id
      }
    }`, 'updateRoom', 'Room', false);
  });
  it('should not update room if data is incorrect', () => {
    return test.api.mutation.update(`mutation {
      updateRoom (id: 6, input: {
        floor: "28"
      }) {
        id
      }
    }`, 'updateRoom', 'Room', false);
  });

  it('should delete room if such room exists', () => {
    return test.api.mutation.remove(`mutation {
      removeRoom (id: 6) {
        id
      }
    }`, 'removeRoom', 'Room', true);
  });

  it('should not delete any rooms if such room does not exist', () => {
    return test.api.mutation.remove(`mutation {
      removeRoom (id: 6) {
        id
      }
    }`, 'removeRoom', 'Room', false);
  });
});
