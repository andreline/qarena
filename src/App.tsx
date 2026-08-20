import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { AppLayoutConectado } from '@/components/layout/AppLayoutConectado'
import { RotaProtegida } from '@/components/RotaProtegida'
import { Home } from '@/pages/Home'
import { Cadastro } from '@/pages/Cadastro'
import { Login } from '@/pages/Login'
import { Requisitos } from '@/pages/Requisitos'
import { MassaDeDados } from '@/pages/MassaDeDados'
import { Cursos } from '@/pages/Cursos'
import { Dashboard } from '@/pages/Dashboard'
import { Loja } from '@/pages/Loja'
import { Carrinho } from '@/pages/Carrinho'
import { NotFound } from '@/pages/NotFound'

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/requisitos" element={<Requisitos />} />
        <Route path="/massa-de-dados" element={<MassaDeDados />} />
        <Route path="/cursos" element={<Cursos />} />

        {/* Blocos seguintes: /missoes, /central-de-bugs, /instrucoes */}

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route element={<RotaProtegida />}>
        <Route element={<AppLayoutConectado />}>
          <Route path="/app" element={<Dashboard />} />
          <Route path="/app/loja" element={<Loja />} />
          <Route path="/app/carrinho" element={<Carrinho />} />

          {/* Blocos seguintes: /app/checkout, /app/perfil, /app/pedidos */}
        </Route>
      </Route>
    </Routes>
  )
}
