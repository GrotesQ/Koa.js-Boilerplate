'use strict';

const Koa = require('koa');
const cors = require('@koa/cors');
const logging = require('@kasa/koa-logging');
const requestId = require('@kasa/koa-request-id');
const apmMiddleware = require('./middlewares/apm');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./logger');
const router = require('./routes');
const koaBody = require('koa-body');
const koaSwagger = require('koa2-swagger-ui');
const passport = require('koa-passport');
require('./auth');
const serve = require('koa-static');

class App extends Koa {
  constructor(...params) {
    super(...params);

    // Trust proxy
    this.proxy = true;
    // Disable `console.errors` except development env
    this.silent = this.env !== 'development';

    this.servers = [];

    this._configureMiddlewares();
    this._configureRoutes();
  }

  _configureMiddlewares() {
    this.use(errorHandler());
    this.use(apmMiddleware());
    this.use(requestId());
    this.use(
      logging({
        logger,
        overrideSerializers: false,
      }),
    );
    this.use(
      cors({
        origin: '*',
        allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
        allowHeaders: ['Content-Type', 'Authorization'],
        exposeHeaders: ['Content-Length', 'Date', 'X-Request-Id'],
      }),
    );
    this.use(
      koaBody({
        multipart: true,
        jsonLimit: '50mb',
        formLimit: '50mb',
        textLimit: '50mb',
      }),
    );
    this.use(passport.initialize());
    // swagger ui
    this.use(
      koaSwagger({
        routePrefix: '/swagger', // host at /swagger instead of default /docs
        swaggerOptions: {
          url: '/spec', // example path to json
        },
      }),
    );
    // static paths
    this.use(serve(__dirname + '/../views'));
  }

  _configureRoutes() {
    // Bootstrap application router
    this.use(router.routes());
    this.use(router.allowedMethods());
  }

  listen(...args) {
    const server = super.listen(...args);
    this.servers.push(server);
    return server;
  }

  async terminate() {
    // TODO: Implement graceful shutdown with pending request counter
    for (const server of this.servers) {
      server.close();
    }
  }
}

module.exports = App;
