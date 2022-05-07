import "../styles/globals.css"
import type { AppProps } from "next/app"
import "tailwindcss/tailwind.css"
import MenuProvider from "../components/contexts/MenuProvider"
import AuthProvider from "../components/contexts/AuthProvider"
import Layout from "../components/layouts/Layout"

function MyApp({ Component, pageProps }: AppProps) {
   return (
      <AuthProvider>
         <MenuProvider>
            <Layout>
               <Component {...pageProps} />
            </Layout>
         </MenuProvider>
      </AuthProvider>
   )
}

export default MyApp
