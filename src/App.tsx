import { Route, Routes, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login.tsx';
import RecuperarSenha from './pages/RecuperarSenha.tsx'
import Cadastro from './pages/Cadastro.tsx'
import CadastroProfissional from './pages/CadastroProfissional.tsx';
import CadastroCliente from './pages/CadastroCliente.tsx';

import VisualizarPerfilProfissional from './pages/VisualizarPerfilProfissional'

import TelaInicialPaciente from './pages/TelaInicialCliente.tsx';
import CompatibilidadeComProfissionais from './pages/CompatibilidadeComProfissionais.tsx';
import ProfissionaisEmDestaque from './pages/ProfissionaisEmDestaque.tsx';
import VisualizarPerfilPaciente from './pages/VisualizarPerfilPaciente'

import ValidacaoCadastro from './pages/ValidacaoCadastro.tsx'
import './App.css'
import MarcarComProfissional from './pages/MarcarComProfissional.tsx';
import QuestionarioMatch from './pages/QuestionarioMatch.tsx';
import Agenda from './pages/Agenda.tsx';
import Diario from './pages/Diario.tsx';



function App() {
  return (
    <AuthProvider>
      {/* Toast */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#1E293B',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            fontSize: '14px',
            fontWeight: '600',
          },
        }}
      />

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/recuperar_senha' element={<RecuperarSenha />} />
        <Route path='/cadastro' element={<Cadastro />} />
        <Route path='/cadastro/cliente' element={<CadastroCliente />} />
        <Route path='/cadastro/profissional' element={<CadastroProfissional />} />
        

        {/* Private Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path='/admin/validacao' element={<ValidacaoCadastro />} />

          {/* UC06 - Visualizar cadastro de paciente */}
          <Route path='/paciente/home/' element={<TelaInicialPaciente />} />
          <Route path="/paciente/perfil_do_profissional/:id" element={<MarcarComProfissional />} />
          <Route path='/paciente/compatibilidade/' element={<CompatibilidadeComProfissionais />} />
          <Route path='/paciente/destaque/' element={<ProfissionaisEmDestaque />} />
          <Route path='/perfil/paciente' element={<VisualizarPerfilPaciente />} />
          <Route path='/perfil/paciente/:id' element={<VisualizarPerfilPaciente />} />

          {/* UC07 - Visualizar cadastro de profissional */}
          <Route path='/perfil/profissional' element={<VisualizarPerfilProfissional />} />
          <Route path='/perfil/profissional/:id' element={<VisualizarPerfilProfissional />} />
          
          {/*UC08 Diario*/}
          <Route path='/diario' element={<Diario />} />


          <Route path='/match' element={<QuestionarioMatch />} />
          <Route path='/agenda' element={<Agenda />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
export default App
