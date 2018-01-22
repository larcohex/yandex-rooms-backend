const express = require('express');

const router = express.Router();
const { index } = require('./controllers');
const { models } = require('../models');
const getRecommendation = require('../recommendations/get-recommendation');

router.get('/recommendation', (req, res) => {
  let db = {};
  let id = parseInt(req.query.id);
  let queries = [models.Event.findAll({ raw: true }), models.User.findAll({ raw: true }), models.Room.findAll()];
  Promise.all(queries)
    .then((data) => {
      db.events = data[0];
      db.users = data[1];
      db.rooms = [];
      Promise.all(data[2].map((room) => {
        db.rooms.push(JSON.parse(JSON.stringify(room)));
        return room.getEvents({ include: [{ model: models.User }], order: [[ 'dateStart', 'ASC' ]] });
      })).then((results) => {
        for (let i = 0; i < results.length; ++i) {
          db.rooms[i].events = JSON.parse(JSON.stringify(results[i]));
        }
        let date = {
          start: req.query.dateStart,
          end: req.query.dateEnd
        };
        models.User.findAll({
          where: {
            id: req.query.members
          },
          raw: true
        }).then((members) => {
          res.send(getRecommendation(date, members, db, id));
        });
      });
    });
});

router.get('/', index);

module.exports = router;
