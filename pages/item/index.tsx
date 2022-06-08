import ItemsPage from '../../components/ItemsPage'
import { useRouter } from 'next/router'

const SelectedItemPage = () => {
   const router = useRouter()

   return <ItemsPage query={router.query} />
}

export default SelectedItemPage
