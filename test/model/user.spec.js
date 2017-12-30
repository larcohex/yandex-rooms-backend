const test = require('../util/test');

describe('User', () => {
  it('should have an id field of type INTEGER that is a primary key', () => {
    test.model.attribute('User', 'id', 'INTEGER', ['PRIMARY KEY']);
  });

  it('should have a login field of type STRING that is non-nullable and unique', () => {
    test.model.attribute('User', 'login', 'STRING', ['NOT NULL', 'UNIQUE']);
  });

  it('should have a homeFloor field of type TINYINT', () => {
    test.model.attribute('User', 'homeFloor', 'TINYINT');
  });

  it('should have an avatarUrl field of type STRING that is non-nullable', () => {
    test.model.attribute('User', 'avatarUrl', 'STRING', ['NOT NULL']);
  });

  it('should have many Events of type Event through EventsUsers table', () => {
    test.model.association('User', 'Events', 'Event', { combinedTableName: 'EventsUsers' });
  });
});
