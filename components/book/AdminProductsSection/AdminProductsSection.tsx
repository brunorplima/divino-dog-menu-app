import { filter, pluck, propEq } from 'ramda'
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
import FlavorModel from '../../../models/FlavorModel'
import AdminGeneralProductsView from '../../chapter/AdminGeneralProductsView'
import CategoryModel from '../../../models/CategoryModel'
import AdminCategoriesView from '../AdminCategoriesView'

type Tab = 'menu items' | 'toppings' | 'sauces' | 'flavors' | 'categories'

export type CurrentMenuItem = {
   item: MenuItemModel
   action: 'view' | 'edit'
} | null

export type CurrentProduct = {
   item: ToppingModel | SauceModel | FlavorModel
   action: 'view' | 'edit'
} | null

export type CurrentCategory = {
   item: CategoryModel
   action: 'view' | 'edit'
} | null

const AdminProductsSection = () => {
   const [currentMenuItem, setCurrentMenuItem] = useState<CurrentMenuItem>(null)
   const [currentProduct, setCurrentProduct] = useState<CurrentProduct>(null)
   const [currentCategory, setCurrentCategory] = useState<CurrentCategory>(null)
   const [tab, setTab] = useState<Tab>('menu items')
   const { menuItems, toppings, sauces, flavors, categories } = useContext(menuContext)
   const categoryRelatedMenuItems = useMemo<string>(() => {
      if (currentCategory && currentCategory.item) {
         const associatedMenuItems = filter(propEq('categoryId', currentCategory.item.id), menuItems)
         const menuItemNames = pluck('name', associatedMenuItems)
         return menuItemNames.join(', ')
      }
      return ''
   }, [currentCategory])
   
   const setMenuItemEditMode = (isEdit: boolean) =>
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
                  'flavors'
               )} hover:bg-gray-700 rounded rounded-br-none rounded-bl-none`}
               onClick={() => setTab('flavors')}
            >
               Sabores
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
            title={currentMenuItem?.item.name || ''}
            onClose={() => setCurrentMenuItem(null)}
         >
            {currentMenuItem && currentMenuItem.action === 'view' && (
               <AdminMenuItemView
                  item={currentMenuItem.item}
                  setEditMode={setMenuItemEditMode}
               />
            )}
            {currentMenuItem && currentMenuItem.action === 'edit' && <></>}
         </PrimaryModal>
         
         <PrimaryModal
            id='generalProductsViewEditModal'
            isOpen={!!currentProduct}
            title={currentProduct?.item.name || ''}
            onClose={() => setCurrentProduct(null)}
         >
            {currentProduct && currentProduct.action === 'view' && (
               <AdminGeneralProductsView
                  item={currentProduct.item}
                  setEditMode={setProductEditMode}
               />
            )}
            {currentMenuItem && currentMenuItem.action === 'edit' && <></>}
         </PrimaryModal>
         
         <PrimaryModal
            id='categoriesViewEditModal'
            isOpen={!!currentCategory}
            title={currentCategory?.item.name || ''}
            onClose={() => setCurrentCategory(null)}
         >
            {currentCategory && currentCategory.action === 'view' && (
               <AdminCategoriesView
                  item={currentCategory.item}
                  setEditMode={setCategoryEditMode}
                  associatedMenuItems={categoryRelatedMenuItems}
               />
            )}
            {currentMenuItem && currentMenuItem.action === 'edit' && <></>}
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
                              price={item.price}
                              onView={() => setCurrentProduct({ item, action: 'view' })}
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
                              price={item.price}
                              onView={() => setCurrentProduct({ item, action: 'view' })}
                           />
                        </Fragment>
                     )
                  })}
               {!sauces.length && <EmptyListMessage />}
            </div>
         )}

         {tab === 'flavors' && (
            <div className='rounded border-2 border-gray-700 p-3 rounded-tl-none border-t-8 text-sm flex flex-col gap-2'>
               {!!flavors.length &&
                  flavors.map((item) => {
                     return (
                        <Fragment key={item.id}>
                           <ProductItem
                              name={item.name}
                              isAvailable={item.isAvailable}
                              price={item.price}
                              onView={() => setCurrentProduct({ item, action: 'view' })}
                           />
                        </Fragment>
                     )
                  })}
               {!flavors.length && <EmptyListMessage />}
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
                                 <div className='flex justify-between flex-1'>
                                    <div className='text-base font-bold text-green-600'>
                                       {item.name} ({relatedMenuItems.length})
                                    </div>
                                    <div>Ordem: {item.listOrder}</div>
                                 </div>
                                 <ListItemDetailsEdit horizontal />
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
