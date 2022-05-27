import React from 'react'
import { Field } from 'formik'
import { RiErrorWarningFill } from 'react-icons/ri'
import { FIELD_CLASS_NAME } from '../../../../constants/formConstants'
import DatePicker from 'react-datepicker'
import { IoClose } from 'react-icons/io5'

interface Props {
   readonly name: string
   readonly label: string
   readonly id?: string
   readonly className?: string
   readonly containerClassName?: string
   readonly placeholder?: string
   readonly error?: string | undefined
   readonly touched?: boolean | undefined
}

const DatePickerField: React.FC<Props> = ({
   name,
   label,
   id,
   className,
   containerClassName,
   placeholder,
   error,
   touched
}) => {

   return (
      <div className={`${containerClassName} flex flex-col`}>
         <label className='text-white' htmlFor={id}>
            {label}
         </label>
         <Field
            name={name}
            className={`${FIELD_CLASS_NAME} ${className}`}
         >
            {
               ({ field, form }: any) => (
                  <div className='relative'>
                     <DatePicker
                        dateFormat="dd/MM/yyyy"
                        name={name}
                        onChange={value => form.setFieldValue(name, value)}
                        selected={field.value}
                        customInput={<input type='text' className={`${FIELD_CLASS_NAME} w-full`} />}
                        placeholderText={placeholder}
                        isClearable
                     />
                     <div
                        className="text-gray-400 cursor-pointer w-8 h-8 flex justify-center items-center absolute right-1 top-0"
                        onClick={() => form.setFieldValue(name, undefined)}
                     >
                        <IoClose size={18}/>
                     </div>
                  </div>
               )
            }
         </Field>
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

export default DatePickerField
