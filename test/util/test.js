const Sequelize = require('sequelize');
const { expect } = require('chai');
const { models } = require('../../models/index');
const { isEqualData, includesObject, convertIds, sendQuery, sendMutation } = require('./general');

let CONSTRAINTS = {
  'PRIMARY KEY': { primaryKey: true },
  'NOT NULL': { allowNull: false },
  'UNIQUE': { unique: true }
};

module.exports = {
  // MODEL TESTS
  model: {
    // ATTRIBUTE TEST
    attribute (model, field, type, constraints) { // model - model name, field - column name, type - column type, constraints (optional) - column constraints
      // checking if field exists and is of given type
      expect(models[model].rawAttributes)
        .to.have.own.property(field)
        .with.own.property('type')
        .that.is.an.instanceOf(Sequelize[type]);
      if (constraints) {
        // checking each constraint
        for (let i = 0; i < constraints.length; ++i) {
          expect(models[model].rawAttributes[field])
            .to.include(CONSTRAINTS[constraints[i]]);
        }
      }
    },
    // ASSOCIATION TEST
    association (model, association, target, options) { // model - model name, association - association name, target - association model name, options (optional) - options which generally contains combined table name
      // checking if model has association with target model
      expect(models[model].associations)
        .to.have.own.property(association)
        .that.includes({ target: models[target] });
      if (options) {
        // checking if combined table exists
        let deepHaveProperty = (source, properties) => {
          for (let key in properties) {
            if (properties.hasOwnProperty(key)) {
              if (properties[key] !== null && typeof properties[key] === 'object') {
                deepHaveProperty(source[key], properties[key]);
              } else {
                expect(source).to.have.own.property(key)
                  .that.equals(properties[key]);
              }
            }
          }
        };
        deepHaveProperty(models[model].associations[association], options);
      }
    }
  },
  // GRAPHQL API TESTS
  api: {
    // QUERY TEST
    query (query, field, model, isCorrect, id, associations) { // query - graphql query string, field - response root field, model - model to be queried, isCorrect - test for correctness or wrongness, id (optional) - id of queried item if queried by id, associations (optional) - associations that are to be checked for presence
      let response, result;
      result = sendQuery(query).then((r) => {
        expect(r.status).to.equal(200);
        response = r;
        if (isCorrect) {
          // to compare data returned from graphql request we need to trim timestamps
          let options = {
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
          };
          if (associations) {
            // if associations are queried, we need to include them to check if they are also present in response
            options.include = [];
            for (let key in associations) {
              if (associations.hasOwnProperty(key)) {
                options.include.push({ model: models[associations[key].model], attributes: { exclude: ['createdAt', 'updatedAt'] } });
                if (associations[key].relation === 'belongsTo') {
                  options.attributes.exclude.push(`${associations[key].model}Id`);
                }
              }
            }
          }
          if (id) {
            return models[model].findById(id, options);
          } else {
            return models[model].findAll(options);
          }
        } else {
          // if query is wrong or no data found, data should return null on root field
          expect(r.data)
            .to.have.own.property('data')
            .that.has.own.property(field)
            .that.equals(null);
        }
      });
      if (isCorrect) {
        return result.then((r) => {
          let queryResult = JSON.parse(JSON.stringify(r));
          let type = Object.prototype.toString.call(queryResult);
          // association data needs to be trimmed from sequelize query object
          let trimAssociations = (obj) => {
            for (let key in associations) {
              if (associations.hasOwnProperty(key)) {
                if ('through' in associations[key]) {
                  for (let i = 0; i < obj[key].length; ++i) {
                    delete obj[key][i][associations[key].through];
                  }
                }
                obj[key.toLowerCase()] = obj[key];
                delete obj[key];
              }
            }
          };
          if (type === '[object Object]') {
            trimAssociations(queryResult);
          } else if (type === '[object Array]') {
            for (let i = 0; i < queryResult.length; ++i) {
              trimAssociations(queryResult[i]);
            }
          }
          expect(response.data)
            .to.have.own.property('data')
            .that.has.own.property(field);
          let data = response.data.data[field];
          // ids are returned as string in graphql, so we need to convert them to integers
          convertIds(data);
          expect(isEqualData(data, queryResult))
            .to.equal(true);
        });
      } else return result;
    },
    // MUTATIONS TESTS (each action is separated)
    mutation: {
      create (mutation, field, model, isCorrect) { // mutation - graphql mutation string, field - response root field, model - model to be queried, isCorrect - test for correctness or wrongness
        let result = sendMutation(mutation).then((response) => {
          expect(response.status).to.equal(200);
          if (isCorrect) {
            let id = response.data.data[field].id;
            return models[model].findById(id);
          }
        });
        if (isCorrect) {
          return result.then((response) => {
            // check if item is created
            expect(response).to.not.equal(null);
          });
        } else {
          return result.then().catch((error) => {
            expect(error)
              .to.have.own.property('response')
              .that.has.own.property('data')
              .that.has.own.property('errors');
          });
        }
      },
      update (mutation, field, model, isCorrect, payload, relation) { // mutation - graphql mutation string, field - response root field, model - model to be queried, isCorrect - test for correctness or wrongness, payload - items that are updated, relation - relation info if associated data was updated
        let result = sendMutation(mutation).then((response) => {
          expect(response.status).to.equal(200);
          if (isCorrect) {
            let id = response.data.data[field].id;
            if (relation) {
              return models[model].findById(id, {
                include: [ { model: models[relation.model] } ]
              });
            } else {
              return models[model].findById(id);
            }
          } else {
            expect(response.data).to.have.own.property('errors');
          }
        });
        if (isCorrect) {
          return result.then((response) => {
            for (let key in payload) {
              if (payload.hasOwnProperty(key)) {
                if (relation) {
                  if (relation.action === 'ADD') {
                    expect(includesObject(response[key], payload[key])).to.equal(true);
                  } else {
                    expect(includesObject(response[key], payload[key])).to.equal(false);
                  }
                } else {
                  expect(response[key]).to.equal(payload[key]);
                }
              }
            }
          });
        } else {
          return result.then().catch((error) => {
            expect(error)
              .to.have.own.property('response')
              .that.has.own.property('data')
              .that.has.own.property('errors');
          });
        }
      },
      remove (mutation, field, model, isCorrect) { // mutation - graphql mutation string, field - response root field, model - model to be queried, isCorrect - test for correctness or wrongness
        let result = sendMutation(mutation).then((response) => {
          expect(response.status).to.equal(200);
          if (isCorrect) {
            let id = response.data.data[field].id;
            return models[model].findById(id);
          } else {
            expect(response.data).to.have.own.property('errors');
          }
        });
        if (isCorrect) {
          return result.then((response) => {
            // check if data is removed
            expect(response).to.equal(null);
          });
        } else {
          return result.then().catch((error) => {
            expect(error)
              .to.have.own.property('response')
              .that.has.own.property('data')
              .that.has.own.property('errors');
          });
        }
      }
    }
  }
};
