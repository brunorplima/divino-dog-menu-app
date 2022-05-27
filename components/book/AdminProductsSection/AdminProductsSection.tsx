import { defaultTo, filter, join, pluck, propEq } from 'ramda'
import React, { Fragment, useContext, useMemo, useState } from 'react'
import ProductItem from '../../chapter/ProductItem'
import { menuContext } from '../../contexts/MenuProvider'
import EmptyListMessage from '../../verse/EmptyListMessage'
import ListItemDetailsEdit from '../../verse/ListItemEditDelete'
import MenuItemModel from '../../../models/MenuItemModel'
import AdminMenuItemView from '../../chapter/AdminMenuItemView'
import PrimaryModal from '../PrimaryModal'
import ToppingModel from '../../../models/ToppingModel'
import SauceModel from '../../../models/SauceModel'
import MenuItemOptionModel from '../../../models/MenuItemOptionModel'
import AdminGeneralProductsView from '../../chapter/AdminGeneralProductsView'
import CategoryModel from '../../../models/CategoryModel'
import AdminCategoriesView from '../AdminCategoriesView'
import ModelEditDeleteController from '../../verse/ModelEditDeleteController'
import MenuItemForm from '../../forms/MenuItemForm'
import GeneralProductsForm from '../../forms/GeneralProductsForm'
import CategoryForm from '../../forms/CategoryForm'

type Tab = 'menu items' | 'toppings' | 'sauces' | 'menuItemOptions' | 'categories'

type GeneralProducts = 'toppings' | 'sauces' | 'menuItemOptions'

type ViewEdit = 'view' | 'edit'

export type CurrentMenuItem = {
   item: MenuItemModel
   action: ViewEdit
} | null

export type CurrentProduct = {
   item: ToppingModel | SauceModel | MenuItemOptionModel
   action: ViewEdit
   type: GeneralProducts
} | null

export type CurrentCategory = {
   item: CategoryModel
   action: ViewEdit
} | null

const AdminProductsSection = () => {
   const [currentMenuItem, setCurrentMenuItem] = useState<CurrentMenuItem>(null)
   const [currentProduct, setCurrentProduct] = useState<CurrentProduct>(null)
   const [currentCategory, setCurrentCategory] = useState<CurrentCategory>(null)
   const [tab, setTab] = useState<Tab>('menu items')
   const { menuItems, toppings, sauces, menuItemOptions, categories } = useContext(menuContext)

   const getRelatedMenuItemsString = (type: GeneralProducts) => {
      const listName = type === 'toppings' ? 'toppingIds' : type === 'sauces' ? 'sauceIds' : 'optionIds'
      const items = filter(
         menuItem => Boolean((defaultTo<string[], string[]>([], menuItem[listName])).includes(currentProduct?.item.id || '')),
         menuItems
      )
      return join(', ', pluck('name', items))
   }
   
   const tsfRelatedMenuItems = useMemo(() => {
      if (currentProduct
         && currentProduct.item
         && menuItems) return getRelatedMenuItemsString(currentProduct.type)
      return ''
   }, [currentProduct])
   const categoryRelatedMenuItems = useMemo<string>(() => {
      if (currentCategory && currentCategory.item) {
         const associatedMenuItems = filter(propEq('categoryId', currentCategory.item.id), menuItems)
         const menuItemNames = pluck('name', associatedMenuItems)
         return menuItemNames.join(', ')
      }
      return ''
   }, [currentCategory])
   
   const setMenuItemEditMode = (isEdit: boolean ) =>
      setCurrentMenuItem({ ...currentMenuItem, action: isEdit ? 'edit' : 'view' } as CurrentMenuItem)

   const setProductEditMode = (isEdit: boolean) =>
      setCurrentProduct({ ...currentProduct, action: isEdit ? 'edit' : 'view' } as CurrentProduct)

      const setCategoryEditMode = (isEdit: boolean) =>
      setCurrentCategory({ ...currentCategory, action: isEdit ? 'edit' : 'view' } as CurrentCategory)

   const getActive = (value: Tab) => (tab === value ? 'bg-gray-700' : 'active:bg-gray-500')

   return (
      <div className='text-gray-200'>
         <h1 className='grid place-content-center my-4 text-xl'>Produtos</h1>
         <div className='flex gap-1 px-2 overflow-x-scroll'>
            <div
               className={`max-w-max cursor-pointer px-3 py-2 ${getActive(
                  'menu items'
               )} hover:bg-gray-700 rounded rounded-br-none rounded-bl-none`}
               onClick={() => setTab('menu items')}
            >
               Principais
            </div>
            <div
               className={`max-w-max cursor-pointer px-3 py-2 ${getActive(
                  'toppings'
               )} hover:bg-gray-700 rounded rounded-br-none rounded-bl-none`}
               onClick={() => setTab('toppings')}
            >
               Ingredientes
            </div>
            <div
               className={`max-w-max cursor-pointer px-3 py-2 ${getActive(
                  'sauces'
               )} hover:bg-gray-700 rounded rounded-br-none rounded-bl-none`}
               onClick={() => setTab('sauces')}
            >
               Molhos
            </div>
            <div
               className={`max-w-max cursor-pointer px-3 py-2 ${getActive(
                  'menuItemOptions'
               )} hover:bg-gray-700 rounded rounded-br-none rounded-bl-none`}
               onClick={() => setTab('menuItemOptions')}
            >
               Opções
            </div>
            <div
               className={`max-w-max cursor-pointer px-3 py-2 ${getActive(
                  'categories'
               )} hover:bg-gray-700 rounded rounded-br-none rounded-bl-none`}
               onClick={() => setTab('categories')}
            >
               Categorias
            </div>
         </div>
         
         <PrimaryModal
            id='itemMenuViewEditModal'
            isOpen={!!currentMenuItem}
            title={currentMenuItem?.item?.name || ''}
            onClose={() => setCurrentMenuItem(null)}
         >
            <ModelEditDeleteController
               isEditMode={Boolean(currentMenuItem && currentMenuItem.action === 'edit')}
               setEditMode={setMenuItemEditMode}
            />
            {currentMenuItem && currentMenuItem.action === 'view' && (
               <AdminMenuItemView item={currentMenuItem.item} />
            )}
            {currentMenuItem && currentMenuItem.action === 'edit' && (
               <MenuItemForm
                  item={currentMenuItem.item}
                  onClose={() => setCurrentMenuItem({ ...currentMenuItem, action: 'view' })}
               />
            )}
         </PrimaryModal>
         
         <PrimaryModal
            id='generalProductsViewEditModal'
            isOpen={!!currentProduct}
            title={currentProduct?.item.name || ''}
            onClose={() => setCurrentProduct(null)}
         >
            <ModelEditDeleteController
               isEditMode={Boolean(currentProduct && currentProduct.action === 'edit')}
               setEditMode={setProductEditMode}
            />
            {currentProduct && currentProduct.action === 'view' && (
               <AdminGeneralProductsView
                  item={currentProduct.item}
                  associatedMenuItems={tsfRelatedMenuItems}
               />
            )}
            {currentProduct && currentProduct.action === 'edit' && (
               <GeneralProductsForm
                  item={currentProduct.item}
                  onClose={() => setCurrentProduct({ ...currentProduct, action: 'view' })}
               />
            )}
         </PrimaryModal>
         
         <PrimaryModal
            id='categoriesViewEditModal'
            isOpen={!!currentCategory}
            title={currentCategory?.item.name || ''}
            onClose={() => setCurrentCategory(null)}
         >
            <ModelEditDeleteController
               isEditMode={Boolean(currentCategory && currentCategory.action === 'edit')}
               setEditMode={setCategoryEditMode}
            />
            {currentCategory && currentCategory.action === 'view' && (
               <AdminCategoriesView
                  item={currentCategory.item}
                  associatedMenuItems={categoryRelatedMenuItems}
               />
            )}
            {currentCategory && currentCategory.action === 'edit' && (
               <>
                  <CategoryForm
                     item={currentCategory.item}
                     onClose={() => setCurrentCategory({ ...currentCategory, action: 'view' })}
                  />
               </>
            )}
         </PrimaryModal>

         {tab === 'menu items' && (
            <div className='rounded border-2 border-gray-700 p-3 rounded-tl-none border-t-8 text-sm flex flex-col gap-2'>
               {!!menuItems.length &&
                  menuItems.map((item) => {
                     return (
                        <Fragment key={item.id}>
                           <ProductItem
                              name={item.name}
                              isAvailable={item.isAvailable}
                              onEdit={() => {
                                 setCurrentMenuItem({
                                    item,
                                    action: 'edit'
                                 })
                              }}
                              price={item.price}
                              description={item.description}
                              img={item.img ? item.img : ''}
                              onView={() => setCurrentMenuItem({ item, action: 'view' })}
                           />
                        </Fragment>
                     )
                  })}
               {!menuItems.length && <EmptyListMessage />}
            </div>
         )}

         {tab === 'toppings' && (
            <div className='rounded border-2 border-gray-700 p-3 rounded-tl-none border-t-8 text-sm flex flex-col gap-2'>
               {!!toppings.length &&
                  toppings.map((item) => {
                     return (
                        <Fragment key={item.id}>
                           <ProductItem
                              name={item.name}
                              isAvailable={item.isAvailable}
                              onEdit={() => setCurrentProduct({
                                 item,
                                 action: 'edit',
                                 type: 'toppings'
                              })}
                              price={item.price}
                              onView={() => setCurrentProduct({ item, action: 'view', type: 'toppings' })}
                           />
                        </Fragment>
                     )
                  })}
               {!toppings.length && <EmptyListMessage />}
            </div>
         )}

         {tab === 'sauces' && (
            <div className='rounded border-2 border-gray-700 p-3 rounded-tl-none border-t-8 text-sm flex flex-col gap-2'>
               {!!sauces.length &&
                  sauces.map((item) => {
                     return (
                        <Fragment key={item.id}>
                           <ProductItem
                              name={item.name}
                              isAvailable={item.isAvailable}
                              onEdit={() => setCurrentProduct({
                                 item,
                                 action: 'edit',
                                 type: 'sauces'
                              })}
                              price={item.price}
                              onView={() => setCurrentProduct({ item, action: 'view', type: 'sauces' })}
                           />
                        </Fragment>
                     )
                  })}
               {!sauces.length && <EmptyListMessage />}
            </div>
         )}

         {tab === 'menuItemOptions' && (
            <div className='rounded border-2 border-gray-700 p-3 rounded-tl-none border-t-8 text-sm flex flex-col gap-2'>
               {!!menuItemOptions.length &&
                  menuItemOptions.map((item) => {
                     return (
                        <Fragment key={item.id}>
                           <ProductItem
                              name={item.name}
                              isAvailable={item.isAvailable}
                              onEdit={() => setCurrentProduct({
                                 item,
                                 action: 'edit',
                                 type: 'menuItemOptions'
                              })}
                              price={item.price}
                              onView={() => setCurrentProduct({ item, action: 'view', type: 'menuItemOptions' })}
                           />
                        </Fragment>
                     )
                  })}
               {!menuItemOptions.length && <EmptyListMessage />}
            </div>
         )}

         {tab === 'categories' && (
            <div className='rounded border-2 border-gray-700 p-3 rounded-tl-none border-t-8 text-sm flex flex-col gap-2'>
               {!!categories.length &&
                  categories
                     .sort((a, b) => a.listOrder - b.listOrder)
                     .map((item) => {
                        const relatedMenuItems = filter(propEq('categoryId', item.id), menuItems)
                        return (
                           <Fragment key={item.id}>
                              <div
                                 className='flex rounded bg-gray-600 py-1 px-3 gap-3'
                                 onClick={() => setCurrentCategory({ item, action: 'view' })}
                              >
                                 <div className='flex justify-between flex-1 cursor-pointer'>
                                    <div className='text-base font-bold text-green-600'>
                                       {item.name} ({relatedMenuItems.length})
                                    </div>
                                    <div>Ordem: {item.listOrder}</div>
                                 </div>
                                 <ListItemDetailsEdit
                                    onEdit={() => setCurrentCategory({
                                       item,
                                       action: 'edit'
                                    })}
                                    horizontal
                                 />
                              </div>
                           </Fragment>
                        )
                     })}
               {!categories.length && <EmptyListMessage />}
            </div>
         )}
      </div>
   )
}

export default AdminProductsSection
