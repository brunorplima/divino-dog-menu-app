import '../styles/globals.css'
import type { AppProps } from 'next/app'
import 'tailwindcss/tailwind.css'
import MenuProvider from '../components/contexts/MenuProvider'
import AuthProvider from '../components/contexts/AuthProvider'
import AdminProvider from '../components/contexts/AdminProvider'

function MyApp({ Component, pageProps }: AppProps) {
   return (
      <AuthProvider>
         <AdminProvider>
            <MenuProvider>
               <Component {...pageProps} />
            </MenuProvider>
         </AdminProvider>
      </AuthProvider>
   )
}

export default MyApp
