import { useRouter } from 'next/router'

const excludedPages = ['/account']

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   const router = useRouter()

   if (excludedPages.includes(router.pathname)) return <>{children}</>

   return (
      <div className='scrollable m-auto overflow-scroll'>
         {children}
      </div>
   )
}

export default Layout
