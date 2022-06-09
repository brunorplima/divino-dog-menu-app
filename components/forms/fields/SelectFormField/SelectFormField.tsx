import { Field } from 'formik'
import React from 'react'
import { RiErrorWarningFill } from 'react-icons/ri'
import { FIELD_CLASS_NAME } from '../../../../constants/formConstants'
import CustomSelect from '../../../chapter/CustomSelect'
import { Option } from '../../../chapter/CustomSelect/CustomSelect'

interface Props {
   readonly name: string
   readonly label: string
   readonly options: Option[]
   readonly isMulti?: boolean
   readonly id?: string
   readonly className?: string
   readonly containerClassName?: string
   readonly placeholder?: string
   readonly error?: string | undefined
   readonly touched?: boolean | undefined
}

const SelectFormField: React.FC<Props> = ({
   name,
   label,
   options,
   isMulti,
   id,
   className,
   containerClassName,
   placeholder,
   error,
   touched
}) => (
   <div className={`${containerClassName} flex flex-col`}>
      <label className='text-white' htmlFor={id}>
         {label}
      </label>
      <Field
         name={name}
         className={`${FIELD_CLASS_NAME} ${className}`}
      >
         {
            ({ field, form, meta }: any) => (
               <CustomSelect
                  field={field}
                  form={form}
                  meta={meta}
                  options={options}
                  className={`${className} ${error && touched && 'border-2 border-red-400'}`}
                  isMulti={isMulti}
                  placeholder={placeholder}
               />
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

export default SelectFormField
