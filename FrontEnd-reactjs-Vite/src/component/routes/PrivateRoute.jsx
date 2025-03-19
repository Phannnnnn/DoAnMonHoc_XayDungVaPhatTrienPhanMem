import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";

const PrivateRoute = ({ element, role }) => {
    const { auth } = useContext(AuthContext);

    // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
    if (!auth.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Nếu có role yêu cầu nhưng user không có quyền, chuyển hướng về trang chủ
    if (role && auth.user.role !== role) {
        return <Navigate to="/" replace />;
    }

    return element;
};

export default PrivateRoute;