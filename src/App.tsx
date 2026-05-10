import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login.tsx';
import DeletarConta from './pages/DeletarConta'
import VisualizarPerfilPaciente from './pages/VisualizarPerfilPaciente'

function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path="/conta/excluir" element={<DeletarConta />} />

      {/* UC06 - Visualizar cadastro de paciente */}
      <Route path='/perfil/paciente' element={<VisualizarPerfilPaciente />} />
    </Routes>
  )
}

export default App
