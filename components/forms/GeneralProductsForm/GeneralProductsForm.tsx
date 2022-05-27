import { Field, Form, Formik } from 'formik'
import React from 'react'
import MenuItemOptionModel from '../../../models/MenuItemOptionModel'
import SauceModel from '../../../models/SauceModel'
import ToppingModel from '../../../models/ToppingModel'
import { generalProductFormSchema } from '../../../schemas/generalFormSchema'
import FormField from '../../verse/FormField'
import PrimaryButton from '../../verse/PrimaryButton'

interface GeneralProduct {
   name: string
   isAvailable: boolean
   price?: number
}

const initialGeneralProductValues: GeneralProduct = {
   name: '',
   isAvailable: true
}

interface Props {
   item?: ToppingModel | SauceModel | MenuItemOptionModel
   readonly onClose: () => void
}

const GeneralProductsForm: React.FC<Props> = ({ item, onClose }) => {

   const process = async (values: GeneralProduct) => {
      try {
         if (item) {
            item.modify(values)
            await item.save()
            onClose()
         }
         else {
            // ADD-NEW-ITEM LOGIC GOES HERE
         }
      }
      catch (err: any) {
         console.log(err.message)
      }
   }

   const initialValues: GeneralProduct = item ? item.values() : initialGeneralProductValues

   return (
      <div className='text-white'>
         <Formik
            initialValues={initialValues}
            onSubmit={async values => {
               await process(values)
            }}
            validationSchema={generalProductFormSchema}
         >
            {
               ({ handleSubmit, handleChange, errors, touched, values }) => (
                  <>
                     <Form onSubmit={handleSubmit}>
                        <FormField
                           label='Nome'
                           name='name'
                           containerClassName='mb-3'
                           error={errors.name}
                           touched={touched.name}
                        />
                        
                        <FormField
                           label='Preço'
                           name='price'
                           type='number'
                           containerClassName='mb-3'
                           error={errors.price}
                           touched={touched.price}
                        />
                        
                        <Field>
                           {() => (
                              <div className="flex gap-3 my-4 text-gray-200 items-center mb-3">
                                 <input
                                    type='checkbox'
                                    name='isAvailable'
                                    id='isAvailable'
                                    onChange={handleChange}
                                    checked={values.isAvailable}
                                 />
                                 <label htmlFor="isAvailable">Em estoque</label>
                              </div>
                           )}
                        </Field>

                        <div className="flex justify-center">
                           <PrimaryButton
                              label='Salvar'
                              type='submit'
                           />
                        </div>
                     </Form>
                  </>
               )
            }
         </Formik>
      </div>
   )
}

export default GeneralProductsForm
