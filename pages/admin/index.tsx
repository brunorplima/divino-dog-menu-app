import React, { useContext, useState } from 'react'
import AdminCanceledOrders from '../../components/book/AdminCanceledOrders'
import AdminProductsSection from '../../components/book/AdminProductsSection'
import AdminSettingsSection from '../../components/book/AdminSettingsSection'
import AdminUsersSection from '../../components/book/AdminUsersSection'
import OrderManager from '../../components/book/OrderManager'
import { authContext } from '../../components/contexts/AuthProvider'
import WithSecureAdminAccess from '../../components/hocs/WithSecureAccountAccess'
import AccountFrame from '../../components/layouts/AccountFrame'

export type AdminSection = 'orders' | 'products' | 'settings' | 'users' | 'canceledOrders'

const AdminPage = () => {
   const [section, setSection] = useState<AdminSection>('orders')
   const { user } = useContext(authContext)

   return (
      <WithSecureAdminAccess>
         {user && (
            <AccountFrame setSection={setSection} user={user}>
               {section === 'orders' && <OrderManager />}
               {section === 'products' && <AdminProductsSection />}
               {section === 'settings' && <AdminSettingsSection />}
               {section === 'users' && user.master && <AdminUsersSection />}
               {section === 'canceledOrders' && <AdminCanceledOrders />}
            </AccountFrame>
         )}
      </WithSecureAdminAccess>
   )
}

export default AdminPage
