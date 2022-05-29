import * as Yup from 'yup'
import { REQUIRED } from './schemaUtils'

export const generalProductFormSchema = Yup.object({
   name: Yup.string().required(REQUIRED),
   isAvailable: Yup.boolean().required(REQUIRED),
   price: Yup.number()
})

export const categoryFormSchema = Yup.object({
   name: Yup.string().required(REQUIRED),
   listOrder: Yup.number().required(REQUIRED),
})
