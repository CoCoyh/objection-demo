'use strict';

const Person = require('../models/Person');
const { Model } = require('objection')

module.exports = router => {
  router.get('/eager', async (req, res) => {
    const people = await Person
      .query()
      .eager('pets');

    console.log('1. ', people);
     
    // 在多个级别上获取多个关系
    const peoples = await Person
      .query()
      .eager('[pets, children.[pets, children]]');

    console.log('2. ', peoples);

    const people1 = await Person
      .query()
      .eager({
        pets: true,
        children: {
          pets: true,
          children: true
        }
      });

    console.log('3. ', people1);

    // 递归获取一个关系
    const people2 = await Person
      .query()
      .eager('[pets, children.^]')

    console.log('4. ', people2);

    // 使用modifyEager方法修改关系
    const people3 = await Person
      .query()
      .eager('[children.[pets, movies], movies]')
      .modifyEager('children.pets', builder => {
        builder.where('age', '>', 10).select('name')
      });

    // 关系也可以使用命名过滤器进行修改，如下所示：
    const people4 = await Person
      .query()
      .eager('[pets(selectName, onlyDogs), children(orderByAge).[pets, children]]', {
        selectName: (builder) => {
          builder.select('name')
        },
        orderByAge: (builder) => {
          builder.orderBy('age')
        },
        onlyDogs: (builder) => {
          builder.where('species', 'dog');
        }
      })

    // const people5 = await Person
    //   .query()
    //   .eager(`
    //     children(defaultSelects, orderByAge).[
    //       pets(onlyDogs, orderByName),
    //       movies
    //     ]
    //   `);
    // console.log('5. ', people5);

    // 关系可以使用as关键字别名
    const people6 = await Person
    .query()
    .eager(`[
      children(orderByAge) as kids .[
        pets(filterDogs) as dogs,
        pets(filterCats) as cats

        movies.[
          actors
        ]
      ]
    ]`);

    // 快速路线中的allowEager示例

    const people7 = await Person
      .query()
      .allowEager('[pets, children.pets]')
      .eager(req.query.eager);


    // 可以使用eagerAlgorithm方法更改预先加载算法：
    const people8 = await Person
      .query()
      .eagerAlgorithm(Model.JoinEagerAlgorithm)
      .eager('[pets, children.pets]');

    // 对于每个热切的算法，还有一些快捷方法：
    const people9 = await Person
      .query()
      .joinEager('[pets, children.pets]');

    
    res.send({
      people,
      peoples,
      people1,
      people2,
      people3,
      people4,
      // people5,
      people6,
      people7,
      people8,
      people9,
    });
  });
}