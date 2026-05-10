import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login.tsx';
import RecuperarSenha from './pages/RecuperarSenha.tsx'
import Cadastro from './pages/Cadastro.tsx'
import CadastroCliente from './pages/CadastroCliente.tsx';
import CadastroProfissional from './pages/CadastroProfissional.tsx';

function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/recuperar_senha' element={<RecuperarSenha />} />
      <Route path='/cadastro' element={<Cadastro/>} />
      <Route path='/cadastro/cliente' element={<CadastroCliente/>} />
      <Route path='/cadastro/profissional' element={<CadastroProfissional/>} />
    </Routes>
  )
}

export default App
