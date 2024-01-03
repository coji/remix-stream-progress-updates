import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { setTimeout } from 'timers/promises'
import { type Item } from '~/types/item'

const pathname = (id: string) => path.join('public', 'items', `${id}.json`)

export const createFile = async (message: string) => {
  const id = crypto.randomUUID()
  await fs.mkdir(path.join('public', 'items'), { recursive: true })
  await fs.writeFile(
    pathname(id),
    JSON.stringify({ id, progress: 0, message }, null, 2),
    { encoding: 'utf-8' },
  )
  return id
}

export const getItemFromFile = async (id: string) => {
  const file = await fs
    .readFile(pathname(id), { encoding: 'utf-8' })
    .catch(() => null)
  return file ? (JSON.parse(file) as Item) : null
}

export const listItemIds = async () => {
  const dir = await fs.readdir('./public/items', {
    encoding: 'utf-8',
    withFileTypes: true,
  })

  const ids = dir
    .filter((dirent) => dirent.isFile())
    .map((dirent) => path.basename(dirent.name, '.json'))

  return ids
}

export const deleteAllitems = async () => {
  const ids = await listItemIds()
  await Promise.all(ids.map((id) => fs.unlink(pathname(id))))
}

export const processFile = async (id: string) => {
  const item = await getItemFromFile(id)
  if (!item) {
    throw new Error('Item not found')
  }

  while (item.progress < 100) {
    const delta = Math.ceil(1 + 5 * Math.random())
    await setTimeout(delta * 100)

    item.progress = Math.min(item.progress + delta, 100)
    fs.writeFile(pathname(id), JSON.stringify(item, null, 2), {
      encoding: 'utf-8',
    })
  }
}
