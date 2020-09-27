const express = require("express");
const bodyParser = require('body-parser');
const compression = require('compression');
const morgan = require('morgan');
const session = require('express-session');
const url = require('url');

const projects = require("./projects");
const admin = require("./admin");
const users = require("./usermanager")


module.exports.init = function (db) {
    const app = express();

    app.set('view engine', 'pug');
    app.set('views','./views');

    app.use(express.static('static'));
    app.use(compression());
    app.use(session({secret: "test"}));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // setup routes
    projects.init(app, db, url);
    users.init(app, db, url);
    admin.init(app, db, url);

    return app;
}