import { Form, Formik } from 'formik'
import React, { useMemo } from 'react'
import UserModel from '../../../models/UserModel'
import PrimaryButton from '../../verse/PrimaryButton'
import SelectFormField from '../fields/SelectFormField'

export const ADMIN_USER_TYPE = 'Administrador'
export const REGULAR_USER_TYPE = 'Regular'

export interface UserEditForm {
   userType: typeof ADMIN_USER_TYPE | typeof REGULAR_USER_TYPE
}

interface Props {
   readonly user: UserModel
   readonly onSubmit: (values: UserEditForm) => void 
}

const AdminUserEditForm: React.FC<Props> = ({ user, onSubmit }) => {
   const initialValue: UserEditForm = useMemo(() => {
      if (user.admin) return { userType: ADMIN_USER_TYPE }
      return { userType: REGULAR_USER_TYPE }
   }, [user])

   return (
      <div className=''>
         <div className=''>
            <div className='text-lg text-white mb-4'>
               <div>{user.fullName}</div>
               <div>{user.emailAddress}</div>
            </div>
            <Formik
               initialValues={initialValue}
               onSubmit={onSubmit}
            >
               {({ values }) => (
                  <Form>
                     <SelectFormField
                        label='Tipo de Usuário'
                        name='userType'
                        className='mb-4'
                        options={[
                           {
                              label: REGULAR_USER_TYPE,
                              value: REGULAR_USER_TYPE
                           },
                           {
                              label: ADMIN_USER_TYPE,
                              value: ADMIN_USER_TYPE
                           }
                        ]}
                     />
                     <PrimaryButton
                        label='Salvar'
                        type='submit'
                        disabled={values.userType === initialValue.userType}
                     />
                  </Form>
               )}
            </Formik>
         </div>
      </div>
   )
}

export default AdminUserEditForm
