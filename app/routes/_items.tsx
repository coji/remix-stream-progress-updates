import { Link, Outlet } from '@remix-run/react'
import { AppNavLink } from '~/components/AppNavLink'

export default function Index() {
  return (
    <div className='grid grid-rows-[auto_1fr_auto] h-screen gap-1'>
      <header className='container mx-auto py-2'>
        <h1 className='text-2xl'>
          <Link to='/'>Remix streaming updates</Link>
        </h1>
        <nav className='flex gap-2'>
          <AppNavLink to='/1'>Item 1</AppNavLink>
          <AppNavLink to='/2'>Item 2</AppNavLink>
          <AppNavLink to='/3'>Item 3</AppNavLink>
          <AppNavLink to='/4'>Item 4</AppNavLink>
        </nav>
      </header>

      <main className='container mx-auto'>
        <Outlet />
      </main>

      <footer className='container mx-auto text-center py-2'>
        Copyright &copy; coji.
      </footer>
    </div>
  )
}
