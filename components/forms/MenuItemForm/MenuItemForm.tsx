import { Field, Form, Formik, getIn } from 'formik'
import { has, isEmpty, isNil, mergeLeft, omit, reject } from 'ramda'
import React, { useContext } from 'react'
import { MenuItem } from '../../../models/interfaces'
import MenuItemModel from '../../../models/MenuItemModel'
import menuItemFormSchema from '../../../schemas/menuItemSchema'
import { storeFile } from '../../../utils/firebaseHelper'
import { getOptionsFromList, getWeekDayOptions } from '../../../utils/modelHelper'
import { menuContext } from '../../contexts/MenuProvider'
import FormField from '../../forms/fields/FormField'
import PrimaryButton from '../../verse/PrimaryButton'
import DatePickerField from '../fields/DatePickerField'
import FileFormField from '../fields/FileFormField'
import SelectFormField from '../fields/SelectFormField'

export type MenuItemFormSchema = Partial<Omit<MenuItem, 'id' | 'price'>> & {
   img?: File | string
   price: number | ''
}

interface Props {
   onClose?: () => void
   onCloseWithItem?: (item: MenuItemModel) => void
   item?: MenuItemModel
}

const MenuItemForm: React.FC<Props> = ({ onClose, onCloseWithItem, item }) => {
   const { categories, toppings, sauces, menuItemOptions } = useContext(menuContext)

   const initialValues: MenuItemFormSchema = item
      ? item.values()
      : {
         name: '',
         price: '',
         isAvailable: true,
         categoryId: '',
         optionIds: [],
         toppingIds: [],
         sauceIds: [],
         description: '',
         img: ''
      }

   const process = async (values: MenuItemFormSchema): Promise<MenuItemModel | undefined> => {
      try {
         let imageUrl
         if (values.img) imageUrl = await storeFile(values.img as File, MenuItemModel.PATH)
         const nonEmptyValues = reject(
            val => isNil(val) || isEmpty(val),
            mergeLeft({ img: imageUrl }, values)
         )

         if (item) {
            if (values.img) {
               item.modify({ img: imageUrl })
            } else {
               if (has('img', item.values())) item.removeProp('img')
            }
            if (item.hasPromo() && !has('promoPrice', values)) item.removeProp('promoPrice')
            item.modify(omit(['img'], { ...nonEmptyValues, price: nonEmptyValues.price as number }))
            item.save()
         }
         else {
            const menuItem = new MenuItemModel({
               ...omit(['id'], {
                  ...nonEmptyValues,
                  listOrder: nonEmptyValues.listOrder ? nonEmptyValues.listOrder : 999
               }) as MenuItem,
            })
            if (values.img) menuItem.modify({ img: imageUrl })
            await menuItem.save()

            return menuItem
         }
      }
      catch (err: any) {
         console.log(err)
         console.log(err.message)
      }
   }

   const validatePromoPrice = (values: MenuItemFormSchema) => {
      const errors: any = {}
      const promoPrice = values.promoPrice
      if (promoPrice) {
         if ((promoPrice.price && !promoPrice.dateLimit) || (!promoPrice.price && promoPrice.dateLimit)) {
            if (!has('promoPrice', errors)) errors.promoPrice = {}
            errors.promoPrice.price = 'Preencha ambos preço e prazo ou deixe-os em branco'
            errors.promoPrice.dateLimit = 'Preencha ambos preço e prazo ou deixe-os em branco'
         }
      }
      return errors
   }

   return (
      <div>
         <Formik
            initialValues={initialValues}
            validate={(values) => validatePromoPrice(values)}
            onSubmit={async (values) => {
               let menuItem
               if (values.promoPrice && (!values.promoPrice.price || !values.promoPrice.dateLimit)) {
                  menuItem = await process(omit(['promoPrice'], values))
               }
               else menuItem = await process(values)
               if (menuItem && onCloseWithItem) onCloseWithItem(menuItem)
               else if (onClose) onClose()
            }}
            validationSchema={menuItemFormSchema}
            render={({ handleSubmit, handleChange, errors, touched, values, setFieldValue }) => {
               return (
                  <>
                     <Form onSubmit={handleSubmit}>
                        <FileFormField
                           label='Imagem'
                           name='img'
                           containerClassName='mb-3'
                           values={values}
                           error={errors.img}
                           touched={touched.img}
                        />

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
                        
                        <FormField
                           label='Descrição'
                           name='description'
                           as='textarea'
                           containerClassName='mb-3'
                           className='h-28'
                           error={errors.description}
                           touched={touched.description}
                        />
                        
                        <Field>
                           {() => (
                              <div className="flex gap-3 my-4 text-gray-200 items-center">
                                 <input
                                    type='checkbox'
                                    name='isAvailable'
                                    id='isAvailable'
                                    onChange={handleChange}
                                    checked={values.isAvailable ? true : false}
                                 />
                                 <label htmlFor="isAvailable">Em estoque</label>
                              </div>
                           )}
                        </Field>

                        <SelectFormField
                           name='categoryId'
                           label='Categoria'
                           containerClassName='mb-3'
                           options={getOptionsFromList(categories)}
                           error={errors.categoryId}
                           touched={touched.categoryId}
                        />
                        
                        <FormField
                           label='Ordem de categoria'
                           name='listOrder'
                           type='number'
                           containerClassName='mb-3'
                           error={errors.listOrder}
                           touched={touched.listOrder}
                        />

                        <SelectFormField
                           name='toppingIds'
                           label='Ingredientes'
                           containerClassName='mb-3'
                           options={getOptionsFromList(toppings)}
                           isMulti
                           error={errors.toppingIds}
                           touched={touched.toppingIds}
                        />

                        <SelectFormField
                           name='sauceIds'
                           label='Molhos'
                           containerClassName='mb-3'
                           options={getOptionsFromList(sauces)}
                           isMulti
                           error={errors.sauceIds}
                           touched={touched.sauceIds}
                        />

                        <SelectFormField
                           name='optionIds'
                           label='Opções'
                           containerClassName='mb-3'
                           options={getOptionsFromList(menuItemOptions)}
                           isMulti
                           error={errors.optionIds}
                           touched={touched.optionIds}
                        />

                        <SelectFormField
                           name='weekDays'
                           label='Dias Disponíveis (se não servir todo dia)'
                           containerClassName='mb-3'
                           options={getWeekDayOptions()}
                           isMulti
                           error={errors.sauceIds}
                           touched={touched.sauceIds}
                        />

                        <span className='text-gray-100'>Adicionar promoção</span>
                        <div className="p-3 mb-3 bg-gray-700 rounded">
                           <div className={`text-gray-100 mb-2 text-sm`}>
                              {item?.promoPrice ? 'Promoção em vigor' : 'Não há promoção atualmente'}
                           </div>
                           <div className="my-2">
                              <PrimaryButton
                                 label='Apagar Campos'
                                 clickHandler={(e: React.SyntheticEvent) => {
                                    setFieldValue('promoPrice.price', '')
                                    setFieldValue('promoPrice.dateLimit', '')
                                    setTimeout(() => {
                                       setFieldValue('promoPrice', undefined)
                                    }, 30);
                                 }}
                              />
                           </div>
                           <FormField
                              label='Preço promocional'
                              name='promoPrice.price'
                              type='number'
                              containerClassName='mb-3'
                              error={getIn(errors, 'promoPrice.price')}
                              touched={getIn(touched, 'promoPrice.price')}
                           />
                           
                           <DatePickerField
                              label='Prazo'
                              name='promoPrice.dateLimit'
                              containerClassName='mb-10'
                              error={getIn(errors, 'promoPrice.dateLimit')}
                              touched={getIn(touched, 'promoPrice.dateLimit')}
                           />
                        </div>

                        <div className="flex justify-center">
                           <PrimaryButton
                              label='Salvar'
                              type='submit'
                           />
                        </div>
                     </Form>
                  </>
               )
            }}
         />
      </div>
   )
}

export default MenuItemForm
