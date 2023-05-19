import { NextPage } from 'next'
import React from 'react'
import TrackingOrderPage from '../../components/TrackingOrderPage'
import Layout from '../../components/layouts/Layout'

const TrackOrderPage: NextPage = () => {
   return (
      <Layout>
         <TrackingOrderPage />
      </Layout>
   )
}

export default TrackOrderPage
