const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const whiteList = ["/", "/login", "/register"];
    const requestUrl = req.originalUrl;

    if (whiteList.some((item) => ('/v1/api' + item) === requestUrl)) {
        return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ EC: "Token không tồn tại hoặc không đúng định dạng!" });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decode.id,
            name: decode.name,
            email: decode.email,
            role: decode.role
        };
        next();
    } catch (error) {
        return res.status(401).json({ EC: "Token không hợp lệ hoặc đã hết hạn!" });
    }
}

module.exports = auth;
