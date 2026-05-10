import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login.tsx';
import DeletarConta from './pages/DeletarConta'

function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
        <Route path="/conta/excluir" element={<DeletarConta />} />
    </Routes>
  )
}

export default App
