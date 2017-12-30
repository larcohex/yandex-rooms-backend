const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    login: { type: Sequelize.STRING, allowNull: false, unique: true },
    homeFloor: Sequelize.TINYINT,
    avatarUrl: { type: Sequelize.STRING, allowNull: false }
  });

  const Room = sequelize.define('Room', {
    title: { type: Sequelize.STRING, allowNull: false, unique: true },
    capacity: { type: Sequelize.SMALLINT, allowNull: false },
    floor: { type: Sequelize.TINYINT, allowNull: false }
  });

  const Event = sequelize.define('Event', {
    title: { type: Sequelize.STRING, allowNull: false },
    dateStart: { type: Sequelize.DATE, allowNull: false },
    dateEnd: { type: Sequelize.DATE, allowNull: false }
  });

  const EventUser = sequelize.define('Events_Users', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true }
  });

  Event.belongsToMany(User, { through: EventUser });
  User.belongsToMany(Event, { through: EventUser });
  Room.hasMany(Event, { foreign_key: { allowNull: false }, onDelete: 'cascade' });
  Event.belongsTo(Room, { foreign_key: { allowNull: false } });

  return {
    Room, Event, User
  };
};
