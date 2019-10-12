'use strict';
/**
 * 图插入
 */
const { transaction } = require('objection');
const Person = require('../models/Person');


module.exports = router => {
  router.get('/insert', async (req, res) => {

    // 示例
    const graph = await transaction(Person.knex(), trx => {
      return (
        Person.query(trx)
          .insertGraph({
            firstName: 'Sylvester',
            lastName: 'Stallone',

            children: [{
              firstName: 'Sage',
              lastName: 'Stallone',

              pets: [{
                name: 'Fluffy',
                species: 'dog',
              }]
            }]
          })
      );
    });

    // 如果需要在多个位置引用同一模型，则可以使用特殊属性#id, # ref
    const graph1 = await Person
      .query()
      .insertGraph([{
        firstName: 'Jennifer',
        lastName: 'Lawrence',

        movies: [{
          "#id": 'silverLiningsPlaybook',
          name: 'Silver Linings Playbook',
        }]
      }, {
        firstName: 'Brafley',
        lastName: 'Cooper',

        movies: [{
          "#ref": 'silverLiningsPlaybook',
        }]
      }]);

    // 可以使用format表达式在图形中的任何位置引用其他模型的属性，#ref{<id>.<property>}只要引用不会创建循环依赖项即可
    const graph2 = await Person
      .query()
      .insertGraph([{
        "#id": 'jenni',
        firstName: 'Jennifer',
        lastName: 'Lawrence',

        pets: [{
          name: 'I am the dog of #ref{jenni.firstName} whose id is #ref{jenni.id}',
          species: 'dog',
        }]
      }])

    const graph3 = await Person
      .query()
      .insertGraph([{
        firstName: 'Jennifer',
        lastName: 'Lawrence',
    
        movies: [{
          id: 1
        }]
      }], {
        relate: true
      });

    // 与上一个同样的效果
    const graph4 = await Person
      .query()
      .insertGraph([{
        firstName: 'Jennifer',
        lastName: 'Lawrence',

        movies: [{
          id: 1
        }]
      }], {
        relate: [
          'movies'
        ]
      });


    const graph5 = await Person
      .query()
      .insertGraph([{
        firstName: 'Jennifer',
        lastName: 'Lawrence',
    
        movies: [{
          name: 'Silver Linings Playbook',
    
          actors: [{
            id: 1
          }]
        }]
      }], {
        relate: [
          'movies.actors'
        ]
      });

    // 如果需要混合插入并在大拇哥关系中进行关联，则可以使用特殊属性#dbRef
    const graph6 = await Person
      .query()
      .insertGraph([{
        firstName: 'Jennifer',
        lastName: 'Lawrence',

        movies: [{
          '#dbRef': 5,
        }, {
          id: 1002,
          name: 'new new Movie'
        }]
      }])


    
    res.send({
      graph,
      graph1,
      graph2,
      graph3,
      graph4,
      graph5,
      graph6,
    })
  })
}