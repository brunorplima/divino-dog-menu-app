import { useEffect, useState } from "react"
import PuffLoader from "react-spinners/PuffLoader"

const loaderLayout = (loading: boolean) => {
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

const LoaderComponent = () => {
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      setLoading(false)
   }, [])

   return <>{loading && loaderLayout(loading)}</>
}

export default LoaderComponent
