import { Formik } from 'formik'
import React from 'react'
import FormComponent from './FormComponent'

export interface UserSearchForm {
   searchText: string
   searchProp: 'emailAddress' | 'firstName' | 'lastName'
}

interface Props {
   readonly onSubmit: (values: UserSearchForm) => void
   readonly isLoading: boolean
   readonly searchValues: UserSearchForm | null
}

const AdminUsersSearchForm: React.FC<Props> = ({ onSubmit, isLoading, searchValues }) => {
   const initialValues: UserSearchForm = { searchText: '', searchProp: 'emailAddress' }

   return (
      <div className='rounded border-2 border-gray-700 p-3 rounded-tl-none border-t-8 text-sm flex flex-col gap-2 items-center'>
         <div className='gap-3 my-4 text-gray-200 max-w-sm ml-auto mr-auto'>
            <Formik
               initialValues={initialValues}
               onSubmit={onSubmit}
            >
               {({ values, resetForm }) => (
                  <FormComponent {...{ values, isLoading, resetForm, searchValues }} />
               )}
            </Formik>
         </div>
      </div>
   )
}

export default AdminUsersSearchForm
