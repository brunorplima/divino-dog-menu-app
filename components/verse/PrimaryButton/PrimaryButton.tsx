import React, { MouseEventHandler, useMemo } from 'react'

type BgColor = 'gray' | 'green'

interface Props {
   readonly label: string,
   readonly disabled?: boolean
   readonly type?: 'button' | 'submit' | 'reset',
   readonly clickHandler?: Function
   readonly icon?: any,
   readonly bgColor?: BgColor
   readonly className?: string
}

const PrimaryButton: React.FC<Props> = ({
   label,
   disabled,
   icon,
   clickHandler = () => {},
   type = 'button',
   bgColor = 'gray',
   className = ''
}) => {

   const bgColorStyle = useMemo(() => {
      return bgColor === 'gray' ? 'bg-gray-500 hover:bg-gray-400' : 'bg-green-500 hover:bg-green-700'
   }, [bgColor])

   return (
      <button
         type={type}
         className={`${bgColorStyle} py-2 px-10 w-8 text-white min-w-max flex gap-2 rounded-lg duration-300 ${className}`}
         disabled={disabled}
         onClick={() => clickHandler()}
      >
         <span className='translate-y-1'>
            {icon}
         </span>
         {` ${label}`}
      </button>
   )
}

export default PrimaryButton
