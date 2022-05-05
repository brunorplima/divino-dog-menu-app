import FormField from '../../components/verse/FormField'
import PrimaryButton from '../../components/verse/PrimaryButton'
import {
   createUserWithEmailAndPassword,
   getAuth,
   sendEmailVerification,
   updateProfile,
} from 'firebase/auth'
import { Form, Formik } from 'formik'
import { NextPage } from 'next'
import React, { useState } from 'react'
import UserModel from '../../models/UserModel'
import { signupSchema } from '../../schemas/authSchemas'
import { RiErrorWarningFill, RiLoginBoxLine } from 'react-icons/ri'
import { useRouter } from 'next/router'
import { getAuthErrorMessage } from '../../utils/firebaseAuthHelper'

export type SignupForm = {
   firstName: string
   lastName: string
   emailAddress: string
   password: string
}
const initialSignupValues: SignupForm = {
   emailAddress: '',
   password: '',
   firstName: '',
   lastName: '',
}

const SignupPage: NextPage = () => {
   const [loginError, setLoginError] = useState('')
   const [loading, setLoading] = useState(false)
   const router = useRouter()

   async function onSignupSubmit(values: SignupForm) {
      setLoading(true)
      const { firstName, lastName, password, emailAddress } = values
      const auth = getAuth()
      
      try {
         const credentials = await createUserWithEmailAndPassword(
            auth,
            emailAddress,
            password
         )
         const firebaseUser = credentials.user
         const user = new UserModel({
            id: firebaseUser.uid,
            emailAddress: firebaseUser.email as string,
            firstName,
            lastName,
         })
         await updateProfile(firebaseUser, { displayName: user.toString() })
         await sendEmailVerification(firebaseUser)
         await user.save()
         setLoading(false)
         router.push('/account')
         return true
      } catch (e: any) {
         setLoginError(getAuthErrorMessage(e.message))
         setLoading(false)
         return
      }
   }

   return (
      <div className='text-xl bg-gray-700 h-screen w-screen flex justify-center items-center'>
         <div className='lg:w-1/2 p-5 w-80 rounded-lg'>
            <div className='text-center mb-7'>
               <h1 className='text-4xl text-white'>Cadastro de Usuário</h1>
            </div>

            {loginError && (
               <div className='py-1 px-3 text-red-800 bg-red-300 border-red-800 rounded-xl text-base flex gap-1 mb-3'>
                  <span className='translate-y-1'>
                     <RiErrorWarningFill />
                  </span>{' '}
                  {loginError}
               </div>
            )}

            <div>
               <Formik
                  initialValues={initialSignupValues}
                  onSubmit={async (values, { resetForm }) => {
                     if (await onSignupSubmit(values)) resetForm()
                  }}
                  validationSchema={signupSchema}
                  render={({ errors, touched }) => (
                     <Form>
                        <div className='flex flex-col gap-3'>
                           <FormField
                              name='firstName'
                              label='Primeiro Nome'
                              error={errors.firstName}
                              touched={touched.firstName}
                           />
                           <FormField
                              name='lastName'
                              label='Nome de família'
                              error={errors.lastName}
                              touched={touched.lastName}
                           />
                           <FormField
                              name='emailAddress'
                              type='email'
                              label='Email'
                              error={errors.emailAddress}
                              touched={touched.emailAddress}
                           />
                           <FormField
                              name='password'
                              type='password'
                              label='Senha'
                              error={errors.password}
                              touched={touched.password}
                           />
                        </div>
                        <div className='flex justify-center mt-8'>
                           <PrimaryButton
                              type='submit'
                              disabled={loading}
                              icon={<RiLoginBoxLine />}
                              label='Cadastrar'
                           />
                        </div>
                     </Form>
                  )}
               ></Formik>
            </div>
         </div>
      </div>
   )
}

export default SignupPage
