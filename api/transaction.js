'use strict';

const { transaction } = require('objection');
const Person = require('../models/Person');
const knex = Person.knex();

module.exports = router => {
  router.get('/transaction', async (req, res) => {
    try {
      const returnValue = await transaction(Person.knex(), async(trx) => {
        
      })
    } catch(err) {
      console.error('catch with error： ', error);
    }
  })
}