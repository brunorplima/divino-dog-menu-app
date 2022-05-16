import type { NextPage } from "next"
import Layout from "../components/layouts/Layout"
import MenuList from "../components/MenuList"

const Home: NextPage = () => {
   return (
      <Layout>
         <MenuList />
      </Layout>
   )
}

export default Home
