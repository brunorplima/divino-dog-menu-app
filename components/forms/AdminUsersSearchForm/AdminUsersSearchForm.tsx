import { Field, Form, Formik } from 'formik'
import React from 'react'
import { BiSearchAlt } from 'react-icons/bi'
import PrimaryButton from '../../verse/PrimaryButton'
import FormField from '../fields/FormField'

export interface UserSearchForm {
   searchText: string
   searchProp: 'emailAddress' | 'firstName' | 'lastName'
}

interface Props {
   readonly onSubmit: (values: UserSearchForm) => void
   readonly disableSearch: boolean
}

const AdminUsersSearchForm: React.FC<Props> = ({ onSubmit, disableSearch }) => {
   const initialValues: UserSearchForm = { searchText: '', searchProp: 'emailAddress' }

   return (
      <div className='rounded border-2 border-gray-700 p-3 rounded-tl-none border-t-8 text-sm flex flex-col gap-2 items-center'>
         <div className='gap-3 my-4 text-gray-200 max-w-sm ml-auto mr-auto'>
            <Formik
               initialValues={initialValues}
               onSubmit={onSubmit}
            >
               {() => (
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
                           disabled={disableSearch}
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
               )}
            </Formik>
         </div>
      </div>
   )
}

export default AdminUsersSearchForm
