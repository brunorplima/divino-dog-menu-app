import '../styles/globals.css'
import type { AppProps } from 'next/app'
import 'tailwindcss/tailwind.css'
import MenuProvider from '../components/contexts/MenuProvider'
import AuthProvider from '../components/contexts/AuthProvider'

function MyApp({ Component, pageProps }: AppProps) {
   return (
      <AuthProvider>
         <MenuProvider>
            <Component {...pageProps} />
         </MenuProvider>
      </AuthProvider>
   )
}

export default MyApp
