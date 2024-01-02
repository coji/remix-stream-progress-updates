import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import type { ActionFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Form } from '@remix-run/react'

function processFile(pathname: string) {
  if (!fs.existsSync(pathname)) {
    throw new Error()
  }

  const file = fs.readFileSync(pathname, { encoding: 'utf-8' })
  if (!file) {
    throw new Error()
  }

  const item = JSON.parse(file.toString())
  console.log({ item })

  const interval = setInterval(() => {
    item.progress = Math.min(
      Math.ceil(item.progress + 1 + 5 * Math.random()),
      100,
    )

    if (item.progress === 100) {
      clearInterval(interval)
    }

    fs.writeFileSync(pathname, JSON.stringify(item, null, 2))
  }, 500)
}

export async function action({ request }: ActionFunctionArgs) {
  const hash = crypto.randomUUID()

  const pathname = path.join('public', 'items', `${hash}.json`)

  if (!fs.existsSync(path.join('public', 'items'))) {
    fs.mkdirSync(path.join('public', 'items'))
  }

  fs.writeFileSync(
    pathname,
    JSON.stringify(
      {
        id: hash,
        progress: 0,
        message: `Hello from ${hash}!`,
      },
      null,
      2,
    ),
  )

  console.log('Starting process for file', pathname)

  void processFile(pathname)

  return redirect(`/${hash}`)
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
