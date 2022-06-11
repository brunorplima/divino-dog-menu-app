import { Field, Form, Formik } from 'formik'
import React from 'react'
import MenuItemOptionModel from '../../../models/MenuItemOptionModel'
import SauceModel from '../../../models/SauceModel'
import ToppingModel from '../../../models/ToppingModel'
import { generalProductFormSchema } from '../../../schemas/generalFormSchemas'
import { GeneralProducts } from '../../book/AdminProductsSection/AdminProductsSection'
import FormField from '../../forms/fields/FormField'
import PrimaryButton from '../../verse/PrimaryButton'

interface GeneralProduct {
   name: string
   isAvailable: boolean
   price?: number | ''
   canBeExtra?: boolean
}

const initialGeneralProductValues: GeneralProduct = {
   name: '',
   isAvailable: true,
   price: '',
   canBeExtra: false
}

interface Props {
   item?: ToppingModel | SauceModel | MenuItemOptionModel
   readonly onClose?: () => void
   readonly onCloseWithItem?: {
      type: GeneralProducts
      close: (item: ToppingModel | SauceModel | MenuItemOptionModel) => void
   }
}

const GeneralProductsForm: React.FC<Props> = ({ item, onClose, onCloseWithItem }) => {

   const process = async (values: GeneralProduct): Promise<ToppingModel | SauceModel | MenuItemOptionModel | undefined> => {
      const nonEmptyValues = { ...values, price: values.price as number }
      try {
         if (item) {
            item.modify(nonEmptyValues)
            await item.save()
         }
         else {
            let model: ToppingModel | SauceModel | MenuItemOptionModel | undefined
            switch (onCloseWithItem?.type) {
               case 'toppings':
                  model = new ToppingModel(nonEmptyValues as ToppingModel)
                  break
               case 'sauces':
                  model = new SauceModel(nonEmptyValues as SauceModel)
                  break
               case 'menuItemOptions':
                  model = new MenuItemOptionModel(nonEmptyValues)
                  break
               default:
                  model = undefined
                  break
            }
            if (model) await model.save()
            return model
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
               const item = await process(values)
               if (item && onCloseWithItem?.close) onCloseWithItem.close(item)
               else if (onClose) onClose()
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
                        
                        <Field>
                           {() => (
                              <div className="flex gap-3 my-4 text-gray-200 items-center mb-3">
                                 <input
                                    type='checkbox'
                                    name='canBeExtra'
                                    id='canBeExtra'
                                    onChange={handleChange}
                                    checked={values.canBeExtra}
                                 />
                                 <label htmlFor="canBeExtra">Adicionável</label>
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
