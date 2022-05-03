import { Field } from 'formik'
import React from 'react'
import { RiErrorWarningFill } from 'react-icons/ri'

interface Props {
   name: string
   label: string
   type?: string
   id?: string
   className?: string
   error?: string | undefined
   touched?: boolean | undefined
}

const TYPE = 'text'
const CLASS_NAME = 'py-1 px-2 rounded-lg'

const FormField: React.FC<Props> = ({
   name,
   label,
   type = TYPE,
   id = name,
   className = CLASS_NAME,
   error,
   touched
}) => {


   return (
      <div className='flex flex-col'>
         <label className='text-white' htmlFor={id}>
            {label}
         </label>
         <Field
            className={className}
            type={type}
            id={id}
            name={name}
         />
         {error && touched && (
            <div className='text-gray-400 text-base flex gap-1'>
               <span className='translate-y-1'>
                  <RiErrorWarningFill />
               </span>
               {' '}
               {error}
            </div>
         )}
      </div>
   )
}

export default FormField
