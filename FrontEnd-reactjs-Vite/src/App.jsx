import Header from './component/layout/header'
import { Outlet } from 'react-router-dom'
import Footer from './component/layout/footer'

function App() {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default App
