import { Outlet } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import Footer from "../layout/footer";

const AdminPage = () => {
    return (
        <>
            <AdminHeader />
            <Outlet />
            <Footer />
        </>
    )
};

export default AdminPage;
