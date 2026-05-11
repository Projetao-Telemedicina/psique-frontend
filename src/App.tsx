import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login.tsx';
import RecuperarSenha from './pages/RecuperarSenha.tsx'
import Cadastro from './pages/Cadastro.tsx'
import CadastroCliente from './pages/CadastroCliente.tsx';
import CadastroProfissional from './pages/CadastroProfissional.tsx';
import DeletarConta from './pages/DeletarConta'
import VisualizarPerfilPaciente from './pages/VisualizarPerfilPaciente'
import EditarPerfilPaciente from './pages/EditarPerfilPaciente'
import EditarPerfilProfissional from './pages/EditarPerfilProfissional'
import VisualizarPerfilProfissional from './pages/VisualizarPerfilProfissional'

function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/recuperar_senha' element={<RecuperarSenha />} />
      <Route path='/cadastro' element={<Cadastro/>} />
      <Route path='/cadastro/cliente' element={<CadastroCliente/>} />
      <Route path='/cadastro/profissional' element={<CadastroProfissional/>} />

      <Route path="/perfil/paciente/editar" element={<EditarPerfilPaciente />} />
      <Route path="/perfil/profissional/editar" element={<EditarPerfilProfissional />} />
      <Route path="/conta/excluir" element={<DeletarConta />} />

      {/* UC06 - Visualizar cadastro de paciente */}
      <Route path='/perfil/paciente' element={<VisualizarPerfilPaciente />} />
      <Route path='/perfil/paciente/:id' element={<VisualizarPerfilPaciente />} />

      {/* UC07 - Visualizar cadastro de profissional */}
      <Route path='/perfil/profissional' element={<VisualizarPerfilProfissional />} />
      <Route path='/perfil/profissional/:id' element={<VisualizarPerfilProfissional />} />
    </Routes>
  )
}

export default App
