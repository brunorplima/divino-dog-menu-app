import '../styles/globals.css'
import type { AppProps } from 'next/app'
import 'tailwindcss/tailwind.css'
import MenuProvider from '../components/contexts/MenuProvider'
import AuthProvider from '../components/contexts/AuthProvider'
import AdminProvider from '../components/contexts/AdminProvider'
import NavBottom from '../components/NavBottom'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }: AppProps) {
   const navBottomLinks = ['/', '/checkout', '/aboutus']
   const router = useRouter()

   return (
      <AuthProvider>
         <AdminProvider>
            <MenuProvider>
               <Component {...pageProps} />
               {navBottomLinks.includes(router.pathname) && <NavBottom />}
            </MenuProvider>
         </AdminProvider>
      </AuthProvider>
   )
}

export default MyApp
