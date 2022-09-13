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
      let className = bgColor === 'gray' ? 'bg-gray-500' : 'bg-green-500'
      if (!disabled) className += bgColor === 'gray' ? ' hover:bg-gray-400' : ' hover:bg-green-700'
      return className
   }, [bgColor, disabled])

   return (
      <button
         type={type}
         className={`
            ${bgColorStyle} py-2 px-10 w-8 text-white min-w-max flex gap-2 rounded-lg 
            duration-300 ${disabled && 'cursor-not-allowed text-gray-400'} ${className}
         `}
         disabled={disabled}
         onClick={() => clickHandler()}
      >
         {icon && (
            <>
               <span className={label ? 'translate-y-' : ''}>
                  {icon}
               </span>
               {label && ' '}
            </>
         )}
         {label && label}
      </button>
   )
}

export default PrimaryButton
