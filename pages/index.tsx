import type { NextPage } from "next"
import MenuList from "../components/MenuList"

const Home: NextPage = () => {
   return (
      <div className="m-auto lg:w-1/2">
         <MenuList />
      </div>
   )
}

export default Home
