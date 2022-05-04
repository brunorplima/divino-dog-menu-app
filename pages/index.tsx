import type { NextPage } from "next"
import MenuList from "../components/MenuList"
import NavBottom from "../components/NavBottom"

const Home: NextPage = () => {
   return (
      <div className="m-auto lg:w-1/2">
         <MenuList />
         <NavBottom />
      </div>
   )
}

export default Home
