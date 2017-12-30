const test = require('../../util/test');

describe('Users mutation API', () => {
  it('should create user if data is correct', () => {
    return test.api.mutation.create(`mutation {
      createUser (input: {
        login: "test_user"
        homeFloor: 13
        avatarUrl: "test_url"
      }) {
        id
      }
    }`, 'createUser', 'User', true);
  });

  it('should not create user if data is missing or not correct', () => {
    return test.api.mutation.create(`mutation {
      createUser (input: {
        homeFloor: 13
        avatarUrl: "test_url"
      }) {
        id
      }
    }`, 'createUser', 'User', false);
  });

  it('should update user if such user exists and data is correct', () => {
    return test.api.mutation.update(`mutation {
      updateUser (id: 4, input: {
        avatarUrl: "new_test_url"
      }) {
        id
      }
    }`, 'updateUser', 'User', true, {
      avatarUrl: 'new_test_url'
    });
  });

  it('should not update user if such user does not exist', () => {
    return test.api.mutation.update(`mutation {
      updateUser (id: 13, input: {
        avatarUrl: "new_test_url"
      }) {
        id
      }
    }`, 'updateUser', 'User', false);
  });

  it('should not update user if data is incorrect', () => {
    return test.api.mutation.update(`mutation {
      updateUser (id: 4, input: {
        avatarUrl: 13
      }) {
        id
      }
    }`, 'updateUser', 'User', false);
  });

  it('should delete user if such user exists', () => {
    return test.api.mutation.remove(`mutation {
      removeUser (id: 4) {
        id
      }
    }`, 'removeUser', 'User', true);
  });

  it('should not delete any users if such user does not exist', () => {
    return test.api.mutation.remove(`mutation {
      removeUser (id: 4) {
        id
      }
    }`, 'removeUser', 'User', false);
  });
});
