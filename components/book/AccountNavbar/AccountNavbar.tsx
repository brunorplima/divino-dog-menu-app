import React, { useState } from 'react'
import { IoMenu } from 'react-icons/io5'
import { IoMdClose } from 'react-icons/io'
import styles from './AccountNavbar.module.scss'
import { IconType } from 'react-icons'

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

   const animeStyle = menuOpen ? styles.show : styles.hide

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
         <div className={`${animeStyle} absolute bg-gray-700 h-screen z-10 w-screen p-5 flex flex-col items-center gap-5`}>
            {
               options.map(({ Icon, label, clickHandler }) => (
                  <div
                     key={label}
                     className='border-gray-200 flex justify-center gap-3 w-64 py-1 text-xl'
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
         </div>
      </div>
   )
}

export default AccountNavbar
