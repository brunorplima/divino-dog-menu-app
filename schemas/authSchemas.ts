import * as Yup from 'yup'
import { REQUIRED } from './schemaUtils'

const EMAIL_INVALID = 'Email inválido'

export const loginSchema = Yup.object({
   emailAddress: Yup.string().email().required(REQUIRED),
   password: Yup.string().min(8, 'Senha deve ter 8 caracteres ou mais').required(REQUIRED)
})

export const signupSchema = Yup.object({
   firstName: Yup.string().required(REQUIRED),
   lastName: Yup.string().required(REQUIRED),
   emailAddress: Yup.string().email(EMAIL_INVALID).required(REQUIRED),
   password: Yup.string().min(8, 'Senha deve ter 8 caracteres ou mais').required(REQUIRED),
})
