import type { ActionFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { createFile, processFile } from '~/services/long_running_process'

export async function action({ request }: ActionFunctionArgs) {
  const id = await createFile('hello!')
  void processFile(id)

  return redirect(`/${id}`)
}

export default function Index() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1>
        Stream Progress Updates with Remix using Defer, Suspense, and Server
        Sent Events
      </h1>

      <Form method='post'>
        <button type='submit'> Start long-running process </button>
      </Form>
    </div>
  )
}
