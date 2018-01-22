const test = require('../util/test');

describe('Event', () => {
  it('should have an id field of type INTEGER that is a primary key', () => {
    test.model.attribute('Event', 'id', 'INTEGER', ['PRIMARY KEY']);
  });

  it('should have a title field of type STRING that is non-nullable', () => {
    test.model.attribute('Event', 'title', 'STRING', ['NOT NULL']);
  });

  it('should have a dateStart field of type DATE that is non-nullable', () => {
    test.model.attribute('Event', 'dateStart', 'DATE', ['NOT NULL']);
  });

  it('should have a dateEnd field of type DATE that is non-nullable', () => {
    test.model.attribute('Event', 'dateEnd', 'DATE', ['NOT NULL']);
  });

  it('should have many Users of type User through EventsUsers table', () => {
    test.model.association('Event', 'Users', 'User', { combinedTableName: 'EventsUsers' });
  });

  it('should belong to Room of type Room', () => {
    test.model.association('Event', 'Room', 'Room');
  });
});
