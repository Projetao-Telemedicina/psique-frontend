import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Mantém os dados em cache por 5 minutos sem recarregar
      refetchOnWindowFocus: false, // Não faz requisição nova só porque o usuário mudou de aba
    },
  },
})

createRoot(document.getElementById('root')!).render(
  // 3. Envolver a aplicação com o QueryClientProvider
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </QueryClientProvider>
)