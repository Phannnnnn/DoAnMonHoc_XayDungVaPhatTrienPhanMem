const siteRoute = require('./site');
const registerRoute = require('./registerApi');

function route(app) {
    app.use('/v1/api', registerRoute);
    app.use('/', siteRoute);
}

module.exports = route;
