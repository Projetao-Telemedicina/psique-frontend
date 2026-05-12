import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login.tsx';
import RecuperarSenha from './pages/RecuperarSenha.tsx'
import Cadastro from './pages/Cadastro.tsx'
import CadastroCliente from './pages/CadastroCliente.tsx';
import CadastroProfissional from './pages/CadastroProfissional.tsx';
import VisualizarPerfilPaciente from './pages/VisualizarPerfilPaciente'
import VisualizarPerfilProfissional from './pages/VisualizarPerfilProfissional'
import ValidacaoCadastro from './pages/ValidacaoCadastro.tsx'

function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/recuperar_senha' element={<RecuperarSenha />} />
      <Route path='/cadastro' element={<Cadastro/>} />
      <Route path='/cadastro/cliente' element={<CadastroCliente/>} />
      <Route path='/cadastro/profissional' element={<CadastroProfissional/>} />
      <Route path='/admin/validacao' element={<ValidacaoCadastro/>} />


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
