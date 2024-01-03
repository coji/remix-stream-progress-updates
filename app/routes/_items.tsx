import { LoaderFunctionArgs, json } from '@remix-run/node'
import { Link, Outlet, useLoaderData } from '@remix-run/react'
import { AppNavLink } from '~/components/AppNavLink'
import { listItemIds } from '~/services/long_running_process'

export const loader = async (args: LoaderFunctionArgs) => {
  const itemIds = await listItemIds()
  return json({ itemIds })
}

export default function Index() {
  const { itemIds } = useLoaderData<typeof loader>()

  return (
    <div className='grid grid-rows-[auto_1fr_auto] h-screen gap-1'>
      <header className='container mx-auto py-2'>
        <h1 className='text-2xl'>
          <Link to='/'>Remix streaming updates</Link>
        </h1>
        <nav className='flex gap-2 flex-wrap'>
          {itemIds.map((id) => {
            return (
              <AppNavLink key={id} to={`/${id}`}>
                item {id}
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
