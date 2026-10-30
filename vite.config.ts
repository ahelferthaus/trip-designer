import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), ...(mode === 'pilot' ? [{
    name: 'pilot-only-entry',
    transformIndexHtml: { order: 'pre' as const, handler(html: string) { return html.replace('/src/main.tsx', '/src/pilot-main.tsx'); } },
  }] : [])],
  // Older deployments may still define these billing-capable keys. Never embed
  // them in a public preview; physical delivery needs a server-side integration.
  define: {
    'import.meta.env.VITE_LULU_API_KEY': '""',
    'import.meta.env.VITE_THANKS_IO_API_KEY': '""',
  },
}))
