import { Field, Form, FormikState } from 'formik'
import React, { useEffect } from 'react'
import FormField from '../fields/FormField'
import PrimaryButton from '../../verse/PrimaryButton'
import { BiSearchAlt } from 'react-icons/bi'
import { UserSearchForm } from './AdminUsersSearchForm'
import { isNil } from 'ramda'

interface Props {
   readonly values: UserSearchForm
   readonly isLoading: boolean
   readonly resetForm: (nextState?: Partial<FormikState<UserSearchForm>> | undefined) => void
   readonly searchValues: UserSearchForm | null
}

const FormComponent: React.FC<Props> = ({ values, isLoading, resetForm, searchValues }) => {

   useEffect(() => {
      if (isNil(searchValues)) resetForm()
   }, [searchValues])

   return (
      <Form>
         <div className='flex justify-between items-end mb-4'>
            <FormField
               type='text'
               label='Search User'
               name='searchText'
               className={'w-64'}
            />
            <div className='w-4'></div>
            <PrimaryButton
               label=''
               icon={<BiSearchAlt size={20} />}
               className='px-0 py-0 flex justify-center items-center h-8 w-8'
               type='submit'
               disabled={isLoading || !values.searchText.length}
            />
         </div>
         <div className='flex gap-8'>
            <div>
               <Field
                  id='radioEmailAddress'
                  type='radio'
                  name='searchProp'
                  value='emailAddress'
               />{' '}
               <label htmlFor='radioEmailAddress'>Email</label>
            </div>
            <div>
               <Field
                  id='radioFirstName'
                  type='radio'
                  name='searchProp'
                  value='firstName'
               />{' '}
               <label htmlFor='radioFirstName'>Nome</label>
            </div>
            <div>
               <Field
                  id='radioLastName'
                  type='radio'
                  name='searchProp'
                  value='lastName'
               />{' '}
               <label htmlFor='radioLastName'>Nome de Família</label>
            </div>
         </div>
      </Form>
   )
}

export default FormComponent
