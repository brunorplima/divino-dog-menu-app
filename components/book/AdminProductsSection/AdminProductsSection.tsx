import { defaultTo, filter, has, join, pluck, propEq } from 'ramda'
import React, { Fragment, useContext, useMemo, useState } from 'react'
import ProductItem from '../../chapter/ProductItem'
import { menuContext } from '../../contexts/MenuProvider'
import EmptyListMessage from '../../verse/EmptyListMessage'
import ListItemEditDelete from '../../verse/ListItemEditDelete'
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
import DropdownMenuButton from '../../chapter/DropdownMenuButton'

type Tab = 'menu items' | 'toppings' | 'sauces' | 'menuItemOptions' | 'categories'

export type GeneralProducts = 'toppings' | 'sauces' | 'menuItemOptions'

export type ViewEditCreate = 'view' | 'edit' | 'create'

export type CurrentMenuItem = {
   item: MenuItemModel
   action: ViewEditCreate
} | null

export type CurrentProduct = {
   item: ToppingModel | SauceModel | MenuItemOptionModel
   action: ViewEditCreate
   type: GeneralProducts
} | null

export type CurrentCategory = {
   item: CategoryModel
   action: ViewEditCreate
} | null

const AdminProductsSection = () => {
   const [currentMenuItem, setCurrentMenuItem] = useState<CurrentMenuItem>(null)
   const [currentProduct, setCurrentProduct] = useState<CurrentProduct>(null)
   const [currentCategory, setCurrentCategory] = useState<CurrentCategory>(null)
   const [tab, setTab] = useState<Tab>('menu items')
   const { menuItems, toppings, sauces, menuItemOptions, categories } = useContext(menuContext)
   const createProductTitle = useMemo(() => {
      if (currentProduct?.type === 'toppings') return 'Criar Ingrediente'
      if (currentProduct?.type === 'sauces') return 'Criar Molho'
      return 'Criar Opção'
   }, [currentProduct?.type])

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
   const categoryRelatedMenuItems = useMemo<JSX.Element>(() => {
      if (currentCategory && currentCategory.item) {
         const associatedMenuItems = filter(propEq('categoryId', currentCategory.item.id), menuItems)
         const menuItemNames = pluck('name', associatedMenuItems)
         if (menuItemNames.length) {
            return (
               <>
                  {menuItemNames.map((item, idx) => (
                     <div key={item + idx}>- {item}</div>
                  ))}
               </>
            )
         }
      }
      return <div>&nbsp;</div>
   }, [currentCategory])
   
   const setMenuItemEditMode = (action?: ViewEditCreate) =>
      setCurrentMenuItem(action ? { ...currentMenuItem, action } as CurrentMenuItem : null)

   const setProductEditMode = (action?: ViewEditCreate, type?: GeneralProducts) => {
      const current: Partial<CurrentProduct> = { ...currentProduct }
      if (type) current.type = type
      setCurrentProduct(action ? { ...current, action } as CurrentProduct : null)
   }

   const setCategoryEditMode = (action?: ViewEditCreate) =>
      setCurrentCategory(action ? { ...currentCategory, action } as CurrentCategory : null)

   const getActive = (value: Tab) => (tab === value ? 'bg-gray-700' : 'active:bg-gray-500')

   return (
      <div className='text-gray-200 max-w-3xl ml-auto mr-auto mb-10'>
         <div className="grid place-content-center my-4 relative">
            <h1 className='text-xl'>Produtos</h1>
            <div className=''>
               <DropdownMenuButton
                  options={[
                     {
                        label: 'Principal',
                        onClick: () => setMenuItemEditMode('create')
                     },
                     {
                        label: 'Ingrediente',
                        onClick: () => setProductEditMode('create', 'toppings')
                     },
                     {
                        label: 'Molho',
                        onClick: () => setProductEditMode('create', 'sauces')
                     },
                     {
                        label: 'Opção',
                        onClick: () => setProductEditMode('create', 'menuItemOptions')
                     },
                     {
                        label: 'Categoria',
                        onClick: () => setCategoryEditMode('create')
                     }
                  ]}
                  className='absolute right-5 top-1/2 -translate-y-4'
                  buttonClassName='h-8 w-8'
               />
            </div>
         </div>
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
            title={currentMenuItem?.item?.name || 'Criar Item Principal'}
            onClose={() => setCurrentMenuItem(null)}
         >
            <ModelEditDeleteController
               action={currentMenuItem?.action}
               setMode={setMenuItemEditMode}
               onDelete={currentMenuItem?.item ? async () => {
                  await currentMenuItem.item.delete()
                  setCurrentMenuItem(null)
               } : undefined}
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
            {currentMenuItem && currentMenuItem.action === 'create' && (
               <MenuItemForm
                  onCloseWithItem={(item: MenuItemModel) => setCurrentMenuItem({ item, action: 'view' })}
               />
            )}
         </PrimaryModal>
         
         <PrimaryModal
            id='generalProductsViewEditModal'
            isOpen={!!currentProduct}
            title={currentProduct?.item?.name || createProductTitle}
            onClose={() => setCurrentProduct(null)}
         >
            <ModelEditDeleteController
               action={currentProduct?.action}
               setMode={setProductEditMode}
               onDelete={currentProduct?.item ? async () => {
                  await currentProduct.item.delete()
                  setCurrentProduct(null)
               } : undefined}
            />
            {currentProduct && currentProduct.action === 'view' && (
               <AdminGeneralProductsView
                  item={currentProduct.item}
                  associatedMenuItems={tsfRelatedMenuItems}
                  hasCanBeExtra={currentProduct.type !== 'menuItemOptions'}
               />
            )}
            {currentProduct && currentProduct.action === 'edit' && (
               <GeneralProductsForm
                  item={currentProduct.item}
                  hasCanBeExtra={currentProduct.type !== 'menuItemOptions'}
                  onClose={() => setCurrentProduct({ ...currentProduct, action: 'view' })}
               />
            )}
            {currentProduct && currentProduct.action === 'create' && (
               <GeneralProductsForm
                  hasCanBeExtra={currentProduct.type !== 'menuItemOptions'}
                  onCloseWithItem={{
                     type: currentProduct.type,
                     close: (item: ToppingModel | SauceModel | MenuItemOptionModel) =>
                        setCurrentProduct({ item, action: 'view', type: currentProduct.type })
                  }}
               />
            )}
         </PrimaryModal>
         
         <PrimaryModal
            id='categoriesViewEditModal'
            isOpen={!!currentCategory}
            title={currentCategory?.item?.name || 'Criar Categoria'}
            onClose={() => setCurrentCategory(null)}
         >
            <ModelEditDeleteController
               action={currentCategory?.action}
               setMode={setCategoryEditMode}
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
            {currentCategory && currentCategory.action === 'create' && (
               <>
                  <CategoryForm
                     onCloseWithItem={(item: CategoryModel) => setCurrentCategory({ item, action: 'view' })}
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
                              id={item.id}
                              name={item.name}
                              isAvailable={item.isAvailable}
                              onEdit={() => {
                                 setCurrentMenuItem({
                                    item,
                                    action: 'edit'
                                 })
                              }}
                              onDelete={async () => await item.delete()}
                              price={item.price}
                              description={item.description}
                              onView={() => setCurrentMenuItem({ item, action: 'view' })}
                              promotionalPrice={item.promoPrice?.price}
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
                              id={item.id}
                              name={item.name}
                              isAvailable={item.isAvailable}
                              onEdit={() => setCurrentProduct({
                                 item,
                                 action: 'edit',
                                 type: 'toppings'
                              })}
                              onDelete={async () => await item.delete()}
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
                              id={item.id}
                              name={item.name}
                              isAvailable={item.isAvailable}
                              onEdit={() => setCurrentProduct({
                                 item,
                                 action: 'edit',
                                 type: 'sauces'
                              })}
                              onDelete={async () => await item.delete()}
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
                              id={item.id}
                              name={item.name}
                              isAvailable={item.isAvailable}
                              onEdit={() => setCurrentProduct({
                                 item,
                                 action: 'edit',
                                 type: 'menuItemOptions'
                              })}
                              onDelete={async () => await item.delete()}
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
                              >
                                 <div
                                    className='flex justify-between flex-1 cursor-pointer'
                                    onClick={() => setCurrentCategory({ item, action: 'view' })}
                                 >
                                    <div className='text-base font-bold text-green-600'>
                                       {item.name} ({relatedMenuItems.length})
                                    </div>
                                    <div>Ordem: {item.listOrder}</div>
                                 </div>
                                 <ListItemEditDelete
                                    onEdit={() => setCurrentCategory({
                                       item,
                                       action: 'edit'
                                    })}
                                    modalId={`itemEditDelete-${item.id}`}
                                    itemName={item.name}
                                    onDelete={async () => await item.delete()}
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
