import fs from 'node:fs/promises'
import path from 'node:path'
import { LoaderFunctionArgs } from '@remix-run/node'
import { eventStream } from 'remix-utils/sse/server'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const hash = params.hash

  return eventStream(request.signal, send => {
    const interval = setInterval(async () => {
      const file = await fs.readFile(
        path.join('public', 'items', `${hash}.json`),
        'utf-8',
      )
      if (file.toString()) {
        const data = JSON.parse(file.toString())
        const progress = data.progress
        send({ event: 'progress', data: String(progress) })
        if (progress === 100) {
          clearInterval(interval)
        }
      }
    }, 200)
    return () => {
      clearInterval(interval)
    }
  })
}
