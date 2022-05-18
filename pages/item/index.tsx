import ItemsPage from '../../components/ItemsPage'
import { useRouter } from 'next/router'

const SelectedItemPage = () => {
   const router = useRouter()
   const { itemId, catId } = router.query

   return <ItemsPage itemId={itemId} catId={catId} />
}

export default SelectedItemPage
