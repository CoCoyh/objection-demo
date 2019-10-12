'use strict';

/**
 * 图更新
 * upsertGraph
 * 更新具有ID的对象，插入不具有ID的对象，并删除所有不存在的对象
 * 使用时，任何where或having方法都会被忽略
 * 非原子操作
 */

const { transaction } = require('objection');
const Person = require('../models/Person');

module.exports = router => {
  router.get('/upsert', async (req, res) => {

    const graph1 = await Person
    .query()
    .upsertGraph({
      id: 2,
      firstName: 'Jonnifer',

      parent: {
        id: 1,
        firstName: 'John',
        lastName: 'Aniston',
      },

      pets: [{
        name: 'Wolfgang',
        species: 'Dog'
      }, {
        id: 1,
        species: 'Cat',
      }],

      movies: [{
        id: 2,
        name: 'Even Meh',
      }, {
        name: 'Best moive ever',
      }, {
        name: 'Would see again'
      }]
    }, {
      relate: true,
    })

    res.send({
      graph1,
    });
  })
}