import { unstable_vitePlugin as remix } from '@remix-run/dev'
import { installGlobals } from '@remix-run/node'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import remixConfig from './remix.config'

installGlobals()

export default defineConfig({
  plugins: [remix(remixConfig), tsConfigPaths()],
})
