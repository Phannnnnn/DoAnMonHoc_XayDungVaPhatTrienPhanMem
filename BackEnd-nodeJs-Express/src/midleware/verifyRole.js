const verifyRole = (req, res, next) => {
    const whiteList = ["/", "/login", "/register", "/getaccount", "/courselist"];
    const requestUrl = req.originalUrl;

    // Cho phép truy cập nếu URL thuộc danh sách trắng
    if (whiteList.some((item) => ('/v1/api' + item) === requestUrl)) {
        return next();
    }

    const user = req.user;

    // Kiểm tra người dùng đã đăng nhập hay chưa
    if (!user) {
        return res.status(401).json("Vui lòng đăng nhập để truy cập tài nguyên này!");
    }

    // Kiểm tra quyền truy cập
    if (user?.role !== "admin") {
        return res.status(403).json("Tài khoản không được phép truy cập tài nguyên này!");
    }

    next();
};

module.exports = verifyRole;
