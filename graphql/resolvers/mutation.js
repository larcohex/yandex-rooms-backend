const { models } = require('../../models');

module.exports = {
  // User
  createUser (root, { input }) {
    return models.User.create(input);
  },

  updateUser (root, { id, input }) {
    return models.User.findById(id)
      .then(user => user.update(input));
  },

  removeUser (root, { id }) {
    return models.User.findById(id)
      .then(user => user.destroy());
  },

  // Room
  createRoom (root, { input }) {
    return models.Room.create(input);
  },

  updateRoom (root, { id, input }) {
    return models.Room.findById(id)
      .then(room => room.update(input));
  },

  removeRoom (root, { id }) {
    return models.Room.findById(id)
      .then(room => room.destroy());
  },

  // Event
  createEvent (root, { input, usersIds, roomId }) {
    let newEvent = models.Event.build(input);
    newEvent.setRoom(roomId, { save: false });
    newEvent.setUsers(usersIds, { save: false });
    return newEvent.save();
  },

  updateEvent (root, { id, input }) {
    return models.Event.findById(id)
      .then(event => event.update(input));
  },

  removeUserFromEvent (root, { id, userId }) {
    return models.Event.findById(id)
      .then((event) => {
        return event.removeUser(userId).then((r) => {
          switch (r) {
            case 0:
              throw new Error('user could not be deleted');
            case 1:
              return event;
            default:
              throw new Error('unexpected result');
          }
        });
      });
  },

  addUserToEvent (root, { id, userId }) {
    return models.Event.findById(id)
      .then((event) => {
        return event.addUser(userId).then(() => event);
      });
  },

  changeEventRoom (root, { id, roomId }) {
    return models.Event.findById(id)
      .then((event) => {
        return event.setRoom(roomId).then(() => event);
      });
  },

  removeEvent (root, { id }) {
    return models.Event.findById(id)
      .then(event => event.destroy());
  }
};
