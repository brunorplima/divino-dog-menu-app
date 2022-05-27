import { Option } from "../components/chapter/CustomSelect/CustomSelect"
import { UserOrNull } from "../components/contexts/AuthProvider"

export const generateID = () => {	  
   const size = 13
   const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
   let id = ""

   for (let i = 0; i < size; i++) {
      id += possible.charAt(Math.floor(Math.random() * possible.length))
   }

   return id;  
}

export const isAdminUser = (user: UserOrNull) => (user?.admin as boolean) || (user?.master as boolean)

export const getOptionsFromList = (list: { id: string, name: string }[]): Option[] => {
   return list.map(item => ({ label: item.name, value: item.id }))
}
