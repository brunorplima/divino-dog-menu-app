import { Form, Formik } from 'formik'
import { dissoc } from 'ramda'
import React from 'react'
import CategoryModel from '../../../models/CategoryModel'
import { Category } from '../../../models/interfaces'
import { categoryFormSchema } from '../../../schemas/generalFormSchemas'
import FormField from '../../forms/fields/FormField'
import PrimaryButton from '../../verse/PrimaryButton'

type CategoryFormType = {
   name: string,
   listOrder?: number | ''
} 

const initialFormValues: CategoryFormType = {
   name: '',
   listOrder: ''
}

interface Props {
   item?: CategoryModel
   readonly onClose?: () => void
   readonly onCloseWithItem?: (item: CategoryModel) => void
}

const CategoryForm: React.FC<Props> = ({ item, onClose, onCloseWithItem }) => {

   const process = async (values: CategoryFormType) => {
      try {
         if (item) {
            if (!values.listOrder) values = dissoc('listOrder')
            item.modify(values as Category)
            await item.save()
            if (onClose) onClose()
         }
         else {
            const category = new CategoryModel(values as Omit<Category, "id">)
            await category.save()
            if (onCloseWithItem) onCloseWithItem(category)
         }
      }
      catch (err: any) {
         console.log(err.message)
      }
   }

   const initialValues: CategoryFormType = item ? item.values() : initialFormValues

   return (
      <div className='text-white'>
         <Formik
            initialValues={initialValues}
            onSubmit={async values => {
               await process(values)
            }}
            validationSchema={categoryFormSchema}
         >
            {
               ({ handleSubmit, errors, touched }) => (
                  <>
                     <Form onSubmit={handleSubmit}>
                        <FormField
                           label='Name'
                           name='name'
                           containerClassName='mb-3'
                           error={errors.name}
                           touched={touched.name}
                        />
                        
                        <FormField
                           label="List's order"
                           name='listOrder'
                           type='number'
                           containerClassName='mb-3'
                           error={errors.listOrder}
                           touched={touched.listOrder}
                        />

                        <div className="flex justify-center">
                           <PrimaryButton
                              label='Save'
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

export default CategoryForm
