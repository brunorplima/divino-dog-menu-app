import { Fragment, MouseEvent, useEffect, useMemo, useState } from 'react'
import { BiCart, BiStore } from 'react-icons/bi'
import { MdRestaurantMenu } from 'react-icons/md'
import { AiOutlineFileSync } from 'react-icons/ai'
import style from './NavBottom.module.scss'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useElementRefList from '../../hooks/useElementRefList'

export default function NavBottom() {
   const buttons = useMemo(() => [
      { name: 'Cardápio', icon: <MdRestaurantMenu />, link: '/' },
      { name: 'Pedidos', icon: <BiCart />, link: '/checkout' },
      { name: 'Progresso', icon: <AiOutlineFileSync />, link: '/track_order' },
      { name: 'Sobre nós', icon: <BiStore />, link: '/aboutus' }
   ], [])

   const router = useRouter()
   const [position, setPosition] = useState(buttons.findIndex((e) => e.link === router.pathname))

   useEffect(() => {
      setPosition(buttons.findIndex((e) => e.link === router.pathname))
   }, [router])

   const { ElementReffed, ElementReffer } = useElementRefList<HTMLDivElement>()

   const activeClass = (event: MouseEvent) => {
      const currElId = event.currentTarget.id
      ElementReffed.current.forEach((el) => {
         el.id === currElId
            ? (el.className = `${style.button} ${style.active}`)
            : (el.className = style.button)
      })

      setPosition(parseInt(event.currentTarget.id))
   }

   return (
      <div
         className={`${style.navigation} m-auto lg:w-1/2 fixed -bottom-12 flex justify-center items-center h-32 rounded-t-3xl bg-white w-full`}
      >
         <div className={`flex`}>
            {buttons.map((button, index) => (
               <Fragment key={button.name}>
                  <div
                     id={String(index)}
                     className={`${style.button} relative ${
                        button.link === router.pathname && style.active
                     }`}
                     ref={(el) => ElementReffer(el, ElementReffed)}
                     onClick={activeClass}
                  >
                     <Link href={button.link}>
                        <a className='relative flex justify-center items-center flex-col w-full text-center font-light'>
                           <span className={`${style.icon} relative block text-center`}>
                              {button.icon}
                           </span>
                           <span
                              className={`${style.text} absolute font-bold tracking-wider opacity-0`}
                           >
                              {button.name}
                           </span>
                        </a>
                     </Link>
                  </div>
               </Fragment>
            ))}
            <div className={`${style.indicator} absolute`} style={{ transform: `translateX(calc(4.4rem * ${position}))` }}></div>
         </div>
      </div>
   )
}
