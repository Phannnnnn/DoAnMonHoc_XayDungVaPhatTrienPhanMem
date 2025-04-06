const siteRoute = require('./site');
const userRoute = require('./userApi');
const courseRoute = require('./courseApi');
const lessonRoute = require('./lessonApi');
const uploadRoute = require('./uploadApi');

function route(app) {
    app.use('/v1/api', userRoute);
    app.use('/v1/api', courseRoute);
    app.use('/v1/api', uploadRoute);
    app.use('/v1/api', lessonRoute);
    app.use('/', siteRoute);
}

module.exports = route;
