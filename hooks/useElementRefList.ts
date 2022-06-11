import { useRef } from 'react'

export default function useElementRefList<T>() {
   const ElementReffed = useRef<T[]>([])

   const ElementReffer = (el: T | null, ElementReffed: React.MutableRefObject<T[]>) => {
      if (el && !ElementReffed.current.includes(el)) ElementReffed.current.push(el)
   }

   return { ElementReffed, ElementReffer }
}
