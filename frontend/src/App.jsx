import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css'
import API from './Pages/API'
import Home from './Pages/Home/Home'
import Login from './Pages/Login/Login'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/api' element={<API />} />
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
