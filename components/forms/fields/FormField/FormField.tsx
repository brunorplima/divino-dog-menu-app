import { Field } from 'formik'
import React from 'react'
import { RiErrorWarningFill } from 'react-icons/ri'
import { FIELD_CLASS_NAME } from '../../../../constants/formConstants'

interface Props {
   readonly name: string
   readonly label: string
   readonly type?: string
   readonly as?: string
   readonly id?: string
   readonly className?: string
   readonly containerClassName?: string
   readonly error?: string | undefined
   readonly touched?: boolean | undefined
}

const TYPE = 'text'

const FormField: React.FC<Props> = ({
   name,
   label,
   type = TYPE,
   as = '',
   id = name,
   className = '',
   containerClassName = '',
   error,
   touched
}) => (
   <div className={`${containerClassName} flex flex-col`}>
      <label className='text-gray-200' htmlFor={id}>
         {label}
      </label>
      <Field
         as={as}
         className={`${className} ${FIELD_CLASS_NAME} ${error && touched && 'border-2 border-red-400'}`}
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

export default FormField
