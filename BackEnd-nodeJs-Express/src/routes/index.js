const siteRoute = require('./site');
const userRoute = require('./userApi');

function route(app) {
    app.use('/v1/api', userRoute);
    app.use('/', siteRoute);
}

module.exports = route;
