import fs from 'node:fs/promises'
import path from 'node:path'
import { LoaderFunctionArgs } from '@remix-run/node'
import { eventStream } from 'remix-utils/sse/server'
import { getItemFromFile } from '~/services/long_running_process'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { id } = params
  if (!id) {
    throw new Error('No id provided')
  }

  return eventStream(request.signal, (send) => {
    const interval = setInterval(async () => {
      const item = await getItemFromFile(id)
      console.log('progress interval', id, item)
      if (item) {
        send({ event: 'progress', data: String(item.progress) })
        if (item.progress === 100) {
          clearInterval(interval)
        }
      }
    }, 100)
    return () => {
      clearInterval(interval)
    }
  })
}
