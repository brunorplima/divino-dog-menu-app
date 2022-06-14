import { Fragment, MouseEvent, useState } from 'react'
import useLocalStorage from '../../hooks/useLocalStorage'
import { MenuItemGroup } from '../../models/interfaces'
import { MENU_ITEM_GROUP_KEY } from '../../utils/localStorageHelper'
import { BiCart, BiStore } from 'react-icons/bi'
import { MdRestaurantMenu } from 'react-icons/md'
import { BsPersonCircle } from 'react-icons/bs'
import style from './NavBottom.module.scss'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useElementRefList from '../../hooks/useElementRefList'

export default function NavBottom() {
   const buttons = [
      { name: 'Cardápio', icon: <MdRestaurantMenu />, link: '/' },
      { name: 'Pedidos', icon: <BiCart />, link: '/checkout' },
      { name: 'Sobre nós', icon: <BiStore />, link: '/aboutus' },
      { name: 'Perfil', icon: <BsPersonCircle />, link: '/login' },
   ]
   const { storedList } = useLocalStorage<MenuItemGroup>(MENU_ITEM_GROUP_KEY)
   const router = useRouter()
   const position = buttons.findIndex((e) => e.link === router.pathname)

   const [theStyle, setTheStyle] = useState(`translateX(calc(4.4rem * ${position}))`)

   const { ElementReffed, ElementReffer } = useElementRefList<HTMLDivElement>()

   const activeClass = (event: MouseEvent) => {
      const currElId = event.currentTarget.id
      ElementReffed.current.forEach((el) => {
         el.id === currElId
            ? (el.className = `${style.button} ${style.active}`)
            : (el.className = style.button)
      })

      setTheStyle(`translateX(calc(4.4rem * ${event.currentTarget.id}))`)
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
                              {storedList.length > 0 && button.link === '/checkout' && (
                                 <div className='absolute -top-3 right-0 text-sm font-bold'>{storedList.length}</div>
                              )}
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
            <div className={`${style.indicator} absolute`} style={{ transform: theStyle }}></div>
         </div>
      </div>
   )
}
