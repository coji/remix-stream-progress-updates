import fs from 'node:fs'
import path from 'node:path'
import { type LoaderFunctionArgs, defer, redirect } from '@remix-run/node'
import { getFile } from '@remix-run/node/dist/sessions/fileStorage'
import { Await, useLoaderData, useParams } from '@remix-run/react'
import { Suspense } from 'react'
import { useEventSource } from 'remix-utils/sse/react'
import { getItemFromFile } from '~/services/long_running_process'
import type { Item } from '~/types/item'

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params
  if (!id) return redirect('/')

  const item = await getItemFromFile(id)
  if (!item) return redirect('/')

  if (item.progress === 100) {
    return defer({
      promise: item,
    })
  }

  return defer({
    promise: new Promise<Item>((resolve) => {
      const interval = setInterval(async () => {
        const item = await getItemFromFile(id)
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
  const { id } = useParams()
  const stream = useEventSource(`/${id}/progress`, {
    event: 'progress',
  })

  return (
    <div>
      <Suspense fallback={<span>{stream}%</span>}>
        <Await resolve={data.promise} errorElement={<p>Error loading JSON</p>}>
          {(item) => <div>{item.message}</div>}
        </Await>
      </Suspense>
    </div>
  )
}
