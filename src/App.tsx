import { Suspense, lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.css'

import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { EmergencyListener } from './components/EmergencyListener.tsx';

const Login = lazy(() => import('./pages/Login.tsx'));
const RecuperarSenha = lazy(() => import('./pages/RecuperarSenha.tsx'));
const Cadastro = lazy(() => import('./pages/Cadastro.tsx'));
const CadastroProfissional = lazy(() => import('./pages/CadastroProfissional.tsx'));
const CadastroCliente = lazy(() => import('./pages/CadastroCliente.tsx'));

const VisualizarPerfilProfissional = lazy(() => import('./pages/VisualizarPerfilProfissional'));
const TelaInicialPaciente = lazy(() => import('./pages/TelaInicialCliente.tsx'));
const CompatibilidadeComProfissionais = lazy(() => import('./pages/CompatibilidadeComProfissionais.tsx'));
const ProfissionaisEmDestaque = lazy(() => import('./pages/ProfissionaisEmDestaque.tsx'));
const VisualizarPerfilPaciente = lazy(() => import('./pages/VisualizarPerfilPaciente'));

const ValidacaoCadastro = lazy(() => import('./pages/ValidacaoCadastro.tsx'));
const MarcarComProfissional = lazy(() => import('./pages/MarcarComProfissional.tsx'));
const QuestionarioMatch = lazy(() => import('./pages/QuestionarioMatch.tsx'));
const Agenda = lazy(() => import('./pages/Agenda.tsx'));
const Diario = lazy(() => import('./pages/Diario.tsx'));
const Pacientes = lazy(() => import('./pages/Pacientes.tsx'));
const Estatisticas = lazy(() => import('./pages/Estatisticas.tsx'));
const TelaInicialProfissional = lazy(() => import('./pages/TelaInicialProfissional.tsx'));
const Chat = lazy(() => import('./pages/Chat.tsx'));

function App() {
  return (
    <AuthProvider>
      <EmergencyListener />
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


      <Suspense fallback={
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          Carregando... 
        </div>
      }>
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
            <Route path='/profissional/home' element={<TelaInicialProfissional />} />
            
            {/*UC08 Diario*/}
            <Route path='/diario' element={<Diario />} />
            
            <Route path='/estatisticas' element={<Estatisticas />} />
            <Route path='/pacientes' element={<Pacientes />} />
            <Route path='/match' element={<QuestionarioMatch />} />
            <Route path='/agenda' element={<Agenda />} />
            <Route path='/chat' element={<Chat />} />
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}
export default App;