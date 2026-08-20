import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="arena-bg" aria-hidden="true" />
      <div className="arena-grid" aria-hidden="true" />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
