import '../styles/globals.css'
import type { AppProps } from 'next/app'
import 'tailwindcss/tailwind.css'
import '../styles/datepicker.css'
import MenuProvider from '../components/contexts/MenuProvider'
import AuthProvider from '../components/contexts/AuthProvider'
import AdminProvider from '../components/contexts/AdminProvider'
import SettingsProvider from '../components/contexts/SettingsProvider'

function MyApp({ Component, pageProps }: AppProps) {
   return (
      <AuthProvider>
         <AdminProvider>
            <SettingsProvider>
               <MenuProvider>
                  <Component {...pageProps} />
               </MenuProvider>
            </SettingsProvider>
         </AdminProvider>
      </AuthProvider>
   )
}

export default MyApp
