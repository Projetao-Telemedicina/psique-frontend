import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login.tsx';
import DeletarConta from './pages/DeletarConta'
import VisualizarPerfilPaciente from './pages/VisualizarPerfilPaciente'
import EditarPerfilPaciente      from './pages/EditarPerfilPaciente'
import EditarPerfilProfissional  from './pages/EditarPerfilProfissional'

function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />

      <Route path="/perfil/paciente/editar"      element={<EditarPerfilPaciente />} />
      <Route path="/perfil/profissional/editar"  element={<EditarPerfilProfissional />} />
      <Route path="/conta/excluir" element={<DeletarConta />} />

      {/* UC06 - Visualizar cadastro de paciente */}
      <Route path='/perfil/paciente' element={<VisualizarPerfilPaciente />} />
      <Route path='/perfil/paciente/:id' element={<VisualizarPerfilPaciente />} />

    </Routes>
  )
}

export default App
