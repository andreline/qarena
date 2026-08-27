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
import { Instrucoes } from '@/pages/Instrucoes'
import { Missoes } from '@/pages/Missoes'
import { MissaoDetalhe } from '@/pages/MissaoDetalhe'
import { BugReport } from '@/pages/BugReport'
import { CentralDeBugs } from '@/pages/CentralDeBugs'
import { Dashboard } from '@/pages/Dashboard'
import { Loja } from '@/pages/Loja'
import { Carrinho } from '@/pages/Carrinho'
import { Checkout } from '@/pages/Checkout'
import { Perfil } from '@/pages/Perfil'
import { MeusPedidos } from '@/pages/MeusPedidos'
import { RegularizacaoCadastro } from '@/pages/RegularizacaoCadastro'
import { ContaInativa } from '@/pages/ContaInativa'
import { AdminProdutos } from '@/pages/AdminProdutos'
import { EsqueciSenha } from '@/pages/EsqueciSenha'
import { RedefinirSenha } from '@/pages/RedefinirSenha'
import { NotFound } from '@/pages/NotFound'

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />
        <Route path="/requisitos" element={<Requisitos />} />
        <Route path="/massa-de-dados" element={<MassaDeDados />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/instrucoes" element={<Instrucoes />} />
        <Route path="/missoes" element={<Missoes />} />
        <Route path="/missoes/:slug" element={<MissaoDetalhe />} />
        <Route path="/bug-report" element={<BugReport />} />
        <Route path="/central-de-bugs" element={<CentralDeBugs />} />

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route element={<RotaProtegida />}>
        <Route element={<AppLayoutConectado />}>
          <Route path="/app" element={<Dashboard />} />
          <Route path="/app/loja" element={<Loja />} />
          <Route path="/app/carrinho" element={<Carrinho />} />
          <Route path="/app/checkout" element={<Checkout />} />
          <Route path="/app/perfil" element={<Perfil />} />
          <Route path="/app/pedidos" element={<MeusPedidos />} />
          <Route path="/regularizacao" element={<RegularizacaoCadastro />} />
          <Route path="/conta-inativa" element={<ContaInativa />} />
          <Route path="/admin" element={<AdminProdutos />} />
        </Route>
      </Route>
    </Routes>
  )
}
