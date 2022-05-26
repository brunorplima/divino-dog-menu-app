import { useRouter } from 'next/router'
import LoaderComponent from '../../verse/LoaderComponent'

const excludedPages = ['/account']

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   const router = useRouter()

   if (excludedPages.includes(router.pathname)) return <>{children}</>

   return (
      <div className='m-auto lg:w-1/2 overflow-scroll'>
         <LoaderComponent />
         <div className='px-4'>{children}</div>
      </div>
   )
}

export default Layout
