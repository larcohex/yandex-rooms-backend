const test = require('../../util/test');

describe('Users query API', () => {
  it('should give all users', () => {
    return test.api.query(`{
        users {
          id
          login
          homeFloor
          avatarUrl
        }
      }`, 'users', 'User', true);
  });

  it('should give user by correct id', () => {
    return test.api.query(`{
      user(id: 1) {
        id
        login
        homeFloor
        avatarUrl
      }
    }`, 'user', 'User', true, 1);
  });

  it('should give null on incorrect id', () => {
    return test.api.query(`{
      user(id: "sad") {
        id
        login
        homeFloor
        avatarUrl
      }
    }`, 'user', 'User', false);
  });
});
