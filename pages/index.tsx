import type { NextPage } from "next"
import ItemsPage from "../components/ItemsPage"
import MenuList from "../components/MenuList"

const Home: NextPage = () => {
   return (
      <div className="m-auto lg:w-1/2">
         {/* <MenuList /> */}
         <ItemsPage />
      </div>
   )
}

export default Home
