import Header from './component/layout/header'
import { Outlet } from 'react-router-dom'
import Footer from './component/layout/footer'
import { useContext, useEffect } from 'react'
import { AuthContext } from './context/auth.context';
import axios from './ultill/axios.custom';
import { Spin } from "antd";

function App() {
  const { loading, setLoading, setAuth } = useContext(AuthContext);

  useEffect(() => {
    const fetchAccount = async () => {
      setLoading(true);
      const URL_API = "/v1/api/getaccount";
      const res = await axios.get(URL_API);
      if (res && !res.EC) {
        setAuth({
          isAuthenticated: true,
          user: {
            email: res.email ?? "",
            name: res.name ?? "",
            role: res.role ?? "",
          }
        })
      }
      setLoading(false);
    }
    fetchAccount()
  }, [])

  return (
    <div>
      {loading === true ?
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}>
          <Spin />
        </div>
        :
        <>
          <Header />
          <Outlet />
          <Footer />
        </>
      }
    </div>

  )
}

export default App