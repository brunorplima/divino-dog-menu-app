import { useRef } from 'react'

export default function useElementRefList() {
   const ElementReffed = useRef<HTMLInputElement[]>([])

   const ElementReffer = (
      el:
         | HTMLInputElement
         | HTMLDivElement
         | HTMLParagraphElement
         | HTMLAnchorElement
         | HTMLButtonElement
         | HTMLSpanElement
         | HTMLLabelElement
         | null,
      ElementReffed: React.MutableRefObject<any[]>
   ) => {
      if (el && !ElementReffed.current.includes(el)) ElementReffed.current.push(el)
   }

   return { ElementReffed, ElementReffer }
}
