import { useRef } from 'react'

export default function ElementRefList() {
   const ElementReffed = useRef<HTMLInputElement[]>([])

   const ElementReffer = (
      el: HTMLInputElement | null,
      ElementReffed: React.MutableRefObject<any[]>
   ) => {
      if (el && !ElementReffed.current.includes(el)) ElementReffed.current.push(el)
   }

   return { ElementReffed, ElementReffer }
}
