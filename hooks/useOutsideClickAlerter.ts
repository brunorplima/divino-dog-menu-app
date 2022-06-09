import { MutableRefObject, useEffect } from "react"

const useOutsideAlerter = (ref: MutableRefObject<any>, runFunc: Function) => {
   useEffect(() => {
      function handleClickOutside(ev: MouseEvent) {
         if (ref.current && !ref.current.contains(ev.target)) {
            runFunc()
         }
      }
      
      document.addEventListener("mousedown", handleClickOutside)

      return () => {
         document.removeEventListener("mousedown", handleClickOutside)
      }
   }, [ref])
}

export default useOutsideAlerter
