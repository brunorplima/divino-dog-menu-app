import React, { useEffect, useState } from "react"
import NavBottom from "../../NavBottom"
import PuffLoader from "react-spinners/PuffLoader"

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   const [loading, setLoading] = useState(true)

   useEffect(() => {

      return () => setLoading(false)
   }, [])

   const loaderComponent = () => {
      return (
         <>
            <div
               className="text-2xl font-bold text-white flex justify-center items-center h-screen h-screen"
               style={{
                  background: "#222327",
                  zIndex: 2,
               }}
            >
               <PuffLoader color={"#29fd53"} loading={loading} size={60} />
            </div>
         </>
      )
   }

   return (
      <div className="overflow-hidden">
         {loading && loaderComponent()}
         <div className="px-4">{children}</div>
         <NavBottom />
      </div>
   )
}

export default Layout
