const siteRoute = require('./site');
const userRoute = require('./userApi');
const courseRoute = require('./courseApi');

function route(app) {
    app.use('/v1/api', userRoute);
    app.use('/v1/api', courseRoute);
    app.use('/', siteRoute);
}

module.exports = route;
