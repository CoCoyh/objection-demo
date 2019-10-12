const Knex = require('knex');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const promiseRouter = require('express-promise-router');
const knexConfig = require('./knexfile');
const registerApi = require('./router');
const { Model } = require('objection');
const queryApi = require('./api/query');
const relationQuery = require('./api/relationQuery');
const eagerApi = require('./api/eager');
const inserApi = require('./api/insertGraph');
const upsertApi = require('./api/upsertGraph');
const transactionApi = require('./api/transaction');

// Initialize knex.
const knex = Knex(knexConfig.development);

// Bind all Models to a knex instance. If you only have one database in
// your server this is all you have to do. For multi database systems, see
// the Model.bindKnex method.
Model.knex(knex);

const router = promiseRouter();
const app = express()
  .use(bodyParser.json())
  .use(morgan('dev'))
  .use(router)
  .set('json spaces', 2);

// Register our REST API.
registerApi(router);
queryApi(router);
relationQuery(router);
eagerApi(router);
inserApi(router);
upsertApi(router);
transactionApi(router);

// Error handling. The `ValidationError` instances thrown by objection.js have a `statusCode`
// property that is sent as the status code of the response.
//
// NOTE: This is not a good error handler, this is the simplest one. See the error handing
//       recipe for a better handler: http://vincit.github.io/objection.js/#error-handling
app.use((err, req, res, next) => {
  if (err) {
    res.status(err.statusCode || err.status || 500).send(err.data || err.message || {});
  } else {
    next();
  }
});

const server = app.listen(8641, () => {
  console.log('Example app listening at port %s', server.address().port);
});
