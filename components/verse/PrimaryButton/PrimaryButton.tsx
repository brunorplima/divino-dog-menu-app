import React from 'react'

type BgColor = 'none' | 'gray' | 'green' | 'red'

interface Props {
   readonly label: string
   readonly disabled?: boolean
   readonly type?: 'button' | 'submit' | 'reset'
   readonly clickHandler?: Function
   readonly icon?: any
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
   className = '',
}) => {
   const colorMap = {
      red: 'rgba(239, 68, 68, 1)',
      gray: 'rgba(107, 107, 107, 1)',
      green: 'rgba(16, 185, 129, 1)',
      none: 'none',
   }
   const style = {
      backgroundColor: colorMap[bgColor],
   } as React.CSSProperties

   return (
      <button
         type={type}
         className={`py-2 px-10 w-8 text-white min-w-max flex items-center gap-2 rounded-lg 
            duration-300 ${disabled && 'cursor-not-allowed text-gray-400'} ${className}`}
         style={style}
         disabled={disabled}
         onClick={() => clickHandler()}
      >
         {icon && (
            <>
               <span className={label ? 'translate-y-' : ''}>{icon}</span>
               {label && ' '}
            </>
         )}
         {label && label}
      </button>
   )
}

export default PrimaryButton
