import fs from 'node:fs/promises'
import path from 'node:path'
import { type LoaderFunctionArgs, defer, redirect } from '@remix-run/node'
import { Await, useLoaderData, useParams } from '@remix-run/react'
import { Suspense } from 'react'
import { useEventSource } from 'remix-utils/sse/react'
import type { Item } from '~/types/item'

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { hash } = params
  if (!hash) return redirect('/')

  const pathname = path.join('public', 'items', `${hash}.json`)
  const file = await fs.readFile(pathname, 'utf-8')
  if (!file) return redirect('/')

  const item = JSON.parse(file.toString()) as Item
  if (!item) return redirect('/')

  if (item.progress === 100) {
    return defer({
      promise: item,
    })
  }

  return defer({
    promise: new Promise<Item>((resolve) => {
      const interval = setInterval(() => {
        const file = fs.readFile(pathname, 'utf-8')
        if (!file) return
        const item = JSON.parse(file.toString()) as Item
        if (!item) return
        if (item.progress === 100) {
          clearInterval(interval)
          resolve(item)
        }
        return
      }, 100)
    }),
  })
}

export default function ItemPage() {
  const data = useLoaderData<typeof loader>()
  const { hash } = useParams()
  const stream = useEventSource(`/${hash}/progress`, {
    event: 'progress',
  })

  return (
    <div>
      <Suspense fallback={<span> {stream}% </span>}>
        <Await resolve={data.promise} errorElement={<p>Error loading img!</p>}>
          {(item) => <div>{item.message}</div>}
        </Await>
      </Suspense>
    </div>
  )
}
