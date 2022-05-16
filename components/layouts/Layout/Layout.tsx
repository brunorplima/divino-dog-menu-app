import NavBottom from '../../NavBottom'
import LoaderComponent from '../../verse/LoaderComponent'
import style from './Layout.module.scss'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   return (
      <div className={`${style.outsideLayout} overflow-hidden`}>
         <LoaderComponent />
         <div className={`${style.insideLayout} px-4 overflow-y-scroll py-10`}>{children}</div>
         {/* <NavBottom /> */}
      </div>
   )
}

export default Layout
