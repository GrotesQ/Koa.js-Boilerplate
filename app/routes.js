'use strict';

const Router = require('koa-router');
const passport = require('koa-passport');
const AppController = require('./controllers/AppController');
const miscController = require('./controllers/miscController');

const withAuth = passport.authenticate('jwt', { session: false });

const router = new Router();
router.get('/apiInfo', miscController.getApiInfo);
router.get('/spec', miscController.getSwaggerSpec);
router.get('/status', miscController.healthcheck);

router.get('/', AppController.index);

module.exports = router;
