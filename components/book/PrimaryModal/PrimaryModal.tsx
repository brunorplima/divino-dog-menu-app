import React, { useEffect, useState } from 'react'
import ReactModal from 'react-modal'
import { IoClose } from 'react-icons/io5'
import styles from './PrimaryModal.module.scss'

interface Props {
   readonly id: string
   readonly title: string
   readonly isOpen: boolean
   readonly children: React.ReactNode
   readonly onClose: () => void
   readonly titleSize?: 'text-lg' | 'text-xl' | 'text-2xl' | 'text-3xl'
}

const PrimaryModal: React.FC<Props> = ({ id, title, isOpen, onClose, children, titleSize = 'text-2xl' }) => {
   const [afterFirstRender, setAfterFirstRender] = useState(false)

   useEffect(() => {
      const element = document.createElement('div')
      element.id = id
      document.body.append(element)
      setAfterFirstRender(true)
      return element.remove()
   }, [])

   return (
      <>
         {afterFirstRender && (
            <ReactModal
               isOpen={isOpen}
               appElement={document.getElementById(id) as HTMLElement}
               ariaHideApp={false}
               className={`${styles.slideIn} bg-gray-600 h-screen max-w-2xl mr-auto ml-auto overflow-scroll`}
               onRequestClose={onClose}
               shouldCloseOnOverlayClick
            >
               <div className='p-5 flex justify-between border-b border-gray-400 text-gray-100'>
                  <h2 className={titleSize}>{title}</h2>
                  <span onClick={onClose} className='cursor-pointer'>
                     <IoClose size={30} />
                  </span>
               </div>
               <div className='p-5'>{children}</div>
            </ReactModal>
         )}
      </>
   )
}

export default PrimaryModal
