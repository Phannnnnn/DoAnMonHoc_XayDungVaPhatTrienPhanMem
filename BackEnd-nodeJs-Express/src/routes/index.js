const siteRoute = require('./site');
const userRoute = require('./userApi');
const courseRoute = require('./courseApi');
const uploadRoute = require('./uploadApi');

function route(app) {
    app.use('/v1/api', userRoute);
    app.use('/v1/api', courseRoute);
    app.use('/v1/api', uploadRoute);
    app.use('/', siteRoute);
}

module.exports = route;
