import { Form, Formik } from 'formik'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { RiLoginBoxLine, RiErrorWarningFill } from 'react-icons/ri'
import { authContext } from '../../components/contexts/AuthProvider'
import FormField from '../../components/forms/fields/FormField'
import PrimaryButton from '../../components/verse/PrimaryButton'
import { loginSchema } from '../../schemas/authSchemas'
import { getAuthErrorMessage } from '../../utils/firebaseHelper'
import { isAdminUser } from '../../utils/modelHelper'

interface LoginForm {
   emailAddress: string
   password: string
}
const initialLoginValues: LoginForm = {
   emailAddress: '',
   password: '',
}

const LoginPage: NextPage = () => {
   const [loginError, setLoginError] = useState('')
   const [disableButton, setDisableButton] = useState(false)
   const { user, fbUser, login } = useContext(authContext)
   const router = useRouter()

   useEffect(() => {
      if (fbUser && user && fbUser.uid === user.id) {
         if (isAdminUser(user)) router.push('/admin')
         else router.push('/account')
      } 
   }, [fbUser])

   if (fbUser) return null

   async function onLoginSubmit(values: LoginForm) {
      setLoginError('')
      setDisableButton(true)
      const { password, emailAddress } = values
      try {
         const isAdmin = await login(emailAddress, password)
         if (isAdmin) router.push('/admin')
         router.push('/account')
      }
      catch (e: any) {
         setLoginError(getAuthErrorMessage(e.message))
         setDisableButton(false)
      }
   }

   return (
      <div className='text-xl flex justify-center items-center'>
         <div className='lg:w-1/2 p-5 w-80'>
            <div className='text-center mb-4'>
               <h1 className='text-2xl text-white'>Login</h1>
            </div>

            {loginError &&
               <div className='py-1 px-3 text-red-800 bg-red-300 border-red-800 rounded-xl text-base flex gap-1 mb-3'>
                  <span className='translate-y-1'><RiErrorWarningFill/></span> {loginError}
               </div>
            }

            <div>
               <Formik
                  initialValues={initialLoginValues}
                  validationSchema={loginSchema}
                  onSubmit={onLoginSubmit}
                  render={({ touched, errors }) => (
                     <Form>
                        <div className='flex flex-col gap-3'>
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
                              disabled={disableButton}
                              icon={<RiLoginBoxLine />}
                              label='Entrar'
                           />
                        </div>
                     </Form>
                  )}
               />
            </div>

            <br/>

            <div>
               <div className='flex flex-col items-center'>
                  <div className='text-green-400 hover:text-green-500 cursor-pointer mb-2'>Forgot Password?</div>
                  <Link href='/signup'><a className='text-green-400 hover:text-green-500 cursor-pointer'>New user?</a></Link>
               </div>
            </div>
         </div>
      </div>
   )
}

export default LoginPage
