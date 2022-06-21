import Layout from '../../components/layouts/Layout'
import dynamic from 'next/dynamic'

const NonSSROrderPage = dynamic(
   () => import('../../components/OrderPage/OrderPageV2'),
   { ssr: false }   
)

function CheckoutPage() {
   return (
      <Layout>
         <NonSSROrderPage />
      </Layout>
   )
}

export default CheckoutPage
