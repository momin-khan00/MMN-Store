import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '@/context/AuthContext'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import { ThemeProvider } from 'next-themes' // Import ThemeProvider

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <AuthProvider>
        {/* THE FIX: Added styles for light/dark mode */}
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-dark-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
          <Header />
          <main className="flex-grow">
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}
