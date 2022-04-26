import '../styles/globals.css'
import type { AppProps } from 'next/app'
import 'tailwindcss/tailwind.css'
import MenuProvider from '../components/contexts/MenuProvider'

function MyApp({ Component, pageProps }: AppProps) {
   return (
      // We want to add the MenuProvider here so all pages and components
      // can have access to its data.
      <MenuProvider>
         <Component {...pageProps} />
      </MenuProvider>
   )
}

export default MyApp
