import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login.tsx';
import RecuperarSenha from './pages/RecuperarSenha.tsx'

function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/recuperar_senha' element={<RecuperarSenha />} />
    </Routes>
  )
}

export default App
