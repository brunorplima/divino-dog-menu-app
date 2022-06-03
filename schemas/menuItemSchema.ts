import * as Yup from 'yup'
import { REQUIRED } from './schemaUtils'

const menuItemFormSchema =  Yup.object({
   name: Yup.string().required(REQUIRED),
   price: Yup.string().required(REQUIRED),
   isAvailable: Yup.boolean().required(REQUIRED),
   categoryId: Yup.string().required(REQUIRED),
   optionIds: Yup.array(Yup.string()),
   toppingIds: Yup.array(Yup.string()),
   sauceIds: Yup.array(Yup.string()),
   description: Yup.string(),
   listOrder: Yup.number(),
   img: Yup.object().nullable(),
   promoPrice: Yup.object({
      price: Yup.number(),
      dateLimit: Yup.date()
   })
})

export default menuItemFormSchema
