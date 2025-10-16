import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '@/context/AuthContext'
import Header from '@/components/common/Header'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <div className="bg-gray-900 text-gray-100 min-h-screen">
        <Header />
        <main>
          <Component {...pageProps} />
        </main>
      </div>
    </AuthProvider>
  )
}
