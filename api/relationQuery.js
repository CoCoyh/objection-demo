'use strict';
/**
 * 关系查询
 */

const { transaction } = require('objection');
const Person = require('../models/Person');
const Animal = require('../models/Animal');

module.exports = router => {
  router.get('/relationQuery', async (req, res) => {
    const person = await Person
      .query()
      .findOne({ firstname: 'coco' })

    console.log(person);
    
    // 插入查询
    const fluffy = await person
      .$relatedQuery('pets')
      .insert({ name: 'Fluffy', species: 'dog' });

    console.log('1. ', fluffy);
    console.log('2. ', person.pets.indexOf(fluffy) !== -1);
    
    // 查找查询
    const pets = await person
      .$relatedQuery('pets')
      .where('species', 'dog')
      .orderBy('name')

    // select "animals".* from "animals"
    // where "species" = 'dog'
    // and "animals"."ownerId" = 1
    // order by "name" asc
    console.log('3. ', pets);
    console.log('4. ', person.pets === pets);  // -- false？？
    console.log('5. ', pets[0] instanceof Animal); // --> false？？

    // 插入查询-多对对关系
    /**
     * insert into "movies" ("name")
     * values ('The room')

     * insert into "persons_movies" ("movieId", "personId", "awesomeness")
     * values (14, 25, 9001)
     */
    const movie = await person
      .$relatedQuery('movies')
      .insert({name: 'The room ', awesomeness: 9001});

    console.log('best movie ever was added', movie);
    res.send(true);
  })
}