import fs from 'node:fs/promises'
import path from 'node:path'
import { LoaderFunctionArgs, json } from '@remix-run/node'
import { Link, Outlet, useLoaderData } from '@remix-run/react'
import { AppNavLink } from '~/components/AppNavLink'
import type { Item } from '~/types/item'

export const loader = async (args: LoaderFunctionArgs) => {
  const dir = await fs.readdir('./public/items', {
    encoding: 'utf-8',
    withFileTypes: true,
  })

  const items = dir
    .filter((dirent) => dirent.isFile())
    .map((dirent) => path.basename(dirent.name, '.json'))

  return json({ items })
}

export default function Index() {
  const { items } = useLoaderData<typeof loader>()

  return (
    <div className='grid grid-rows-[auto_1fr_auto] h-screen gap-1'>
      <header className='container mx-auto py-2'>
        <h1 className='text-2xl'>
          <Link to='/'>Remix streaming updates</Link>
        </h1>
        <nav className='flex gap-2'>
          {items.map((hash) => {
            return (
              <AppNavLink key={hash} to={`/${hash}`}>
                item {hash}
              </AppNavLink>
            )
          })}
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
