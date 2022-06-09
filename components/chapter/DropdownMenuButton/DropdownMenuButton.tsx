import React, { createRef, useState } from 'react'
import { HiPlus } from 'react-icons/hi'
import useOutsideAlerter from '../../../hooks/useOutsideClickAlerter'

interface DropdownMenuOption {
   readonly label: string,
   readonly onClick: Function
}

interface Props {
   readonly options: DropdownMenuOption[],
   readonly className?: string
   readonly buttonClassName?: string
   readonly optionsClassName?: string
}

const DropdownMenuButton: React.FC<Props> = ({
   options,
   className,
   buttonClassName,
   optionsClassName
}) => {
   const [isOpen, setIsOpen] = useState(false)
   const ref = createRef<HTMLDivElement>()
   useOutsideAlerter(ref, () => setIsOpen(false))

   return (
      <div
         ref={ref}
         className={`text-white ${className} select-none`}
         onClick={() => setIsOpen(!isOpen)}
      >
         <div
            className={`relative`}
         >
            <div
               className={`text-xl cursor-pointer rounded-lg flex justify-center items-center bg-green-600 hover:bg-green-700 duration-100 ${buttonClassName}`}
            >
               <div
                  style={{
                     transform: isOpen ? 'rotate(135deg)' : 'rotate(0deg)',
                     transition: '.2s'
                  }}
               >
                  <HiPlus />
               </div>
            </div>

            {isOpen && (
               <div
                  className={`rounded-lg overflow-hidden ${optionsClassName} absolute top-full translate-y-1 z-10 right-0 animate-fadeIn`}
                  style={{ minWidth: 130 }}
               >
                  {options.map((option, idx) => (
                     <div
                        key={JSON.stringify(option) + idx}
                        className={`p-2 ${idx + 1 !== options.length && 'border-b'} border-gray-300 bg-green-600 hover:bg-green-700 cursor-pointer`}
                        onClick={() => option.onClick()}
                     >
                        {option.label}
                     </div>
                  ))}
               </div>
            )}
         </div>
      </div>
   )
}

export default DropdownMenuButton
