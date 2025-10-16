import type { AppProps } from 'next/app'
// CSS file abhi nahi hai to is line ko comment kar dein ya hata dein
// import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
