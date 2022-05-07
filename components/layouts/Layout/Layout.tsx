import NavBottom from "../../NavBottom"
import LoaderComponent from "../../verse/LoaderComponent"

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   return (
      <div className="overflow-hidden">
         <LoaderComponent />
         <div className="px-4">{children}</div>
         <NavBottom />
      </div>
   )
}

export default Layout
