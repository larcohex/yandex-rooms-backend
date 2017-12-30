const test = require('../util/test');

describe('Room', () => {
  it('should have an id field of type INTEGER that is a primary key', () => {
    test.model.attribute('Room', 'id', 'INTEGER', ['PRIMARY KEY']);
  });

  it('should have a title field of type STRING that is non-nullable and unique', () => {
    test.model.attribute('Room', 'title', 'STRING', ['NOT NULL', 'UNIQUE']);
  });

  it('should have a capacity field of type SMALLINT that is non-nullable', () => {
    test.model.attribute('Room', 'capacity', 'SMALLINT', ['NOT NULL']);
  });

  it('should have a floor field of type TINYINT that is non-nullable', () => {
    test.model.attribute('Room', 'floor', 'TINYINT', ['NOT NULL']);
  });

  it('should have many Events of type Event that are cascaded on delete', () => {
    test.model.association('Room', 'Events', 'Event', { options: { onDelete: 'cascade' } });
  });
});
