import '../styles/globals.css'
import type { AppProps } from 'next/app'
import 'tailwindcss/tailwind.css'
import '../styles/datepicker.css'
import MenuProvider from '../components/contexts/MenuProvider'
import AuthProvider from '../components/contexts/AuthProvider'
import AdminProvider from '../components/contexts/AdminProvider'
import SettingsProvider from '../components/contexts/SettingsProvider'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import LocalStorageProvider from '../components/contexts/LocalStorageProvider'

const NonSSRNavBottom = dynamic(() => import('../components/NavBottom'), { ssr: false })

const navBottomLinks = ['/', '/checkout', '/track_order', '/aboutus']

function MyApp({ Component, pageProps }: AppProps) {
   const router = useRouter()

   return (
      <AuthProvider>
         <AdminProvider>
            <SettingsProvider>
               <MenuProvider>
                  <LocalStorageProvider>
                     <div id='app' className='relative'>
                        <Component {...pageProps} />
                        {navBottomLinks.includes(router.pathname) && <NonSSRNavBottom />}
                     </div>
                  </LocalStorageProvider>
               </MenuProvider>
            </SettingsProvider>
         </AdminProvider>
      </AuthProvider>
   )
}

export default MyApp
