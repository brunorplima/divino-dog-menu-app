import { useState, useEffect } from 'react'
import { BsCheckCircle, BsInfoCircle, BsX, BsXCircle } from 'react-icons/bs'

interface Props {
   type: 'success' | 'info' | 'error'
   title: string
   visibility?: boolean
   children: string
}

type BgColors = 'bg-[#ffffff]' | 'bg-[#b6f8c4]' | 'bg-[#b2e6f5]' | 'bg-[#ffb7b7]'

const ToastNotification: React.FC<Props> = ({ type, title, visibility, children }) => {
   const [showToast, setShowToast] = useState(visibility)
   useEffect(() => setShowToast(visibility), [visibility])

   const [backgroundHex, setBackgroundHex] = useState<BgColors>('bg-[#ffffff]')
   useEffect(() => {
      type === 'success' && setBackgroundHex('bg-[#b6f8c4]')
      type === 'info' && setBackgroundHex('bg-[#b2e6f5]')
      type === 'error' && setBackgroundHex('bg-[#ffb7b7]')

      setTimeout(() => setShowToast(false), 5000)
   }, [])

   const newTitle = title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()

   return (
      <div
         className={`${
            showToast ? '' : 'hidden'
         } fixed right-0 bottom-28 left-0 max-h-fit flex items-center justify-center z-[1000]`}
         onClick={() => setShowToast(false)}
      >
         <div
            className={`${backgroundHex} rounded-lg h-fit text-black fixed flex flex-row items-center justify-center px-5 py-3 gap-5`}
         >
            <div className='text-3xl'>
               {type === 'success' && <BsCheckCircle />}
               {type === 'info' && <BsInfoCircle />}
               {type === 'error' && <BsXCircle />}
            </div>
            <div className='flex flex-row justify-between gap-5'>
               <div>
                  <p className='font-bold'>{newTitle}</p>
                  <p>{children}</p>
               </div>
               <div className='flex items-center justify-center text-2xl'>
                  <BsX />
               </div>
            </div>
         </div>
      </div>
   )
}

export default ToastNotification
