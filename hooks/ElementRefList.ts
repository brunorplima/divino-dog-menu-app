import { useRef } from 'react'

export default function ElementRefList() {
   const ElementReffed = useRef<any[]>([])

   const ElementReffer = (el: any, ElementReffed: React.MutableRefObject<any[]>) => {
      if (el && !ElementReffed.current.includes(el)) ElementReffed.current.push(el)
   }

   return { ElementReffed, ElementReffer }
}
