import React, { useEffect, useState } from 'react'
import AdminCanceledOrders from '../../components/book/AdminCanceledOrders'
import AdminProductsSection from '../../components/book/AdminProductsSection'
import AdminSettingsSection from '../../components/book/AdminSettingsSection'
import OrderManager from '../../components/book/OrderManager'
import useLocalStorageCollection from '../../hooks/useLocalStorageCollection'
import WithSecureAdminAccess from '../../components/hocs/WithSecureAccountAccess'
import AccountFrame from '../../components/layouts/AccountFrame'
import { Topping } from '../../models/interfaces'
import { generateID } from '../../utils/modelHelper'

export type AdminSection = 'orders' | 'products' | 'settings' | 'canceledOrders'

const AdminPage = () => {
   const [section, setSection] = useState<AdminSection>('orders')
   const { collection, addItem, removeItem } = useLocalStorageCollection<Topping>('toppings')

   useEffect(() => {
      const topping: Topping = {
         canBeExtra: true,
         id: generateID(),
         isAvailable: true,
         name: 'Onions'
      }
      removeItem("GN92U7RZNKRFW")
   }, [])
   console.log(collection)


   return (
      <WithSecureAdminAccess>
         <AccountFrame setSection={setSection}>
            {section === 'orders' && <OrderManager />}
            {section === 'products' && <AdminProductsSection />}
            {section === 'settings' && <AdminSettingsSection />}
            {section === 'canceledOrders' && <AdminCanceledOrders />}
         </AccountFrame>
      </WithSecureAdminAccess>
   )
}

export default AdminPage
