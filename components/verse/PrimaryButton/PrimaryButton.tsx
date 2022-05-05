import React from 'react'

interface Props {
   label: string,
   disabled: boolean
   type?: 'button' | 'submit' | 'reset',
   clickHandler?: Function
   icon?: any
}

const PrimaryButton: React.FC<Props> = ({ label, disabled, icon, type = 'button' }) => {
   return (
      <button
         type={type}
         className='py-2 px-10 w-8 bg-gray-500 hover:bg-gray-400 text-white min-w-max flex gap-2 rounded-lg duration-300'
         disabled={disabled}
      >
         <span className='translate-y-1'>
            {icon}
         </span>
         {` ${label}`}
      </button>
   )
}

export default PrimaryButton
