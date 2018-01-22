const Sequelize = require('sequelize');

const scheme = require('./scheme');

const { Op } = Sequelize;

const sequelize = new Sequelize(`${process.env.NODE_ENV}_db`, null, null, {
  dialect: 'sqlite',
  storage: `${process.env.NODE_ENV}_db.sqlite3`,

  operatorsAliases: { $and: Op.and },

  logging: false
});

scheme(sequelize);
sequelize.sync();

module.exports.sequelize = sequelize;
module.exports.models = sequelize.models;
