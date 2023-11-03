import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [
//     vue(),
//   ],
//   resolve: {
//     alias: {
//       '@': fileURLToPath(new URL('./src', import.meta.url))
//     }
//   }
// })


// config pour que ma variable d'environnement fonctton
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return{
    define: {
      'process.env.VUE_APP_API_KEY' : JSON.stringify(env.VUE_APP_API_KEY)
    },
    plugins: [
      vue(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
