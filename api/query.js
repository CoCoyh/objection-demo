'use strict';

const { transaction } = require('objection');
const Person = require('../models/Person');
const Movie = require('../models/Movie');
const Animal = require('../models/Animal');

module.exports = router => {
   /**
    * 插入查询
    */

  router.post('/test', async (req, res) => {
    const jennifer = await transaction(Person.knex(), trx => {
      return (
        Person.query(trx).insert(req.body)
      );
    });

    res.send(jennifer);
  })

  /**
   * 更新查询
   */
  router.patch('/test/:id', async (req, res) => {
    // 更新查询
    const numUpdated = await Person.query()
      .findById(req.params.id)
      .patch(req.body)
    console.log(numUpdated);

    // 更新并获取项目
    const updatePerson = await Person
      .query()
      .patchAndFetchById(req.params.id, req.body)
    res.send(updatePerson);
  });

  /**
   * 关系查询
   */
  router.get('/test', async (req, res) => {
    // 查找查询
    const person = new Person();
    const pets = await person
      .$relatedQuery('pets')
      .where('spacies', 'dog')
      .orderBy('name')

    console.log(pets[0] instanceof Animal);
    
    const people = await Person
      .query()
      .eager('[pets, children.[pets, children]]');

    console.log(people);

    res.send(pets);
  })
}
