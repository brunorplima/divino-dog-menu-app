import React, { useContext, useEffect, useState } from 'react'
import { IoMenu } from 'react-icons/io5'
import { IoMdClose } from 'react-icons/io'
import styles from './AccountNavbar.module.scss'
import { IconType } from 'react-icons'
import { authContext } from '../../contexts/AuthProvider'
import { BiLogOut } from 'react-icons/bi'
import { MdRestaurantMenu } from "react-icons/md"
import Link from 'next/link'

interface Option {
   readonly label: string
   readonly Icon: IconType
   readonly clickHandler: Function
}

interface Props {
   readonly options: Option[]
}

const AccountNavbar: React.FC<Props> = ({ options }) => {
   const [menuOpen, setMenuOpen] = useState(false)
   const [isFirstRender, setIsFirstRender] = useState(true)
   const { auth } = useContext(authContext)

   useEffect(() => {
      if (menuOpen && isFirstRender) setIsFirstRender(false)
   }, [menuOpen])

   const animeStyle = menuOpen ? styles.show : isFirstRender ? styles.initial : styles.hide

   return (
      <div className='relative text-gray-200'>
         <div className='bg-gray-700 py-2 px-3 flex justify-between'>
            <h2>Divino Dog</h2>
            <div onClick={() => setMenuOpen(!menuOpen)}>
               {menuOpen
                  ? <IoMdClose fontSize={28} />
                  : <IoMenu fontSize={28} />
               }
            </div>
         </div>
         <div className={`${animeStyle} ${styles.height} absolute bg-gray-700 h-screen z-10 w-screen px-5 py-20 flex flex-col items-center gap-2`}>
            {
               options.map(({ Icon, label, clickHandler }) => (
                  <div
                     key={label}
                     className='border-gray-200 flex justify-center gap-3 w-64 text-xl py-4'
                     onClick={() => {
                        clickHandler()
                        setMenuOpen(false)
                     }}
                  >
                     <span className='translate-y-1 w-1/12'><Icon /></span>
                     <span className="flex-1">{label}</span>
                  </div>
               ))
            }
            <Link href={'/'}>
               <a
                  className='border-gray-200 flex justify-center gap-3 w-64 text-xl py-4'
                  onClick={() => setMenuOpen(false)}
               >
                  <span className='translate-y-1 w-1/12'><MdRestaurantMenu /></span>
                  <span className="flex-1">Cardápio</span>
               </a>
            </Link>
            <div
               className='border-gray-200 flex justify-center gap-3 w-64 text-xl py-4'
               onClick={() => {
                  auth?.signOut()
                  setMenuOpen(false)
               }}
            >
               <span className='translate-y-1 w-1/12'><BiLogOut /></span>
               <span className="flex-1">Logout</span>
            </div>
         </div>
      </div>
   )
}

export default AccountNavbar
