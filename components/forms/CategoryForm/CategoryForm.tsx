import { Form, Formik } from 'formik'
import React from 'react'
import CategoryModel from '../../../models/CategoryModel'
import { Category } from '../../../models/interfaces'
import { categoryFormSchema } from '../../../schemas/generalFormSchema'
import FormField from '../../verse/FormField'
import PrimaryButton from '../../verse/PrimaryButton'

type CategoryFormType = Partial<Omit<Category, 'id'>>

const initialFormValues: CategoryFormType = {
   name: '',
   listOrder: 0
}

interface Props {
   item?: CategoryModel
   readonly onClose: () => void
}

const CategoryForm: React.FC<Props> = ({ item, onClose }) => {

   const process = async (values: CategoryFormType) => {
      try {
         if (item) {
            item.modify(values)
            await item.save()
            onClose()
         }
         else {
            // ADD NEW ITEM LOGIC GOES HERE
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
                           label='Nome'
                           name='name'
                           containerClassName='mb-3'
                           error={errors.name}
                           touched={touched.name}
                        />
                        
                        <FormField
                           label='Ordem de lista'
                           name='listOrder'
                           type='number'
                           containerClassName='mb-3'
                           error={errors.listOrder}
                           touched={touched.listOrder}
                        />

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

export default CategoryForm
