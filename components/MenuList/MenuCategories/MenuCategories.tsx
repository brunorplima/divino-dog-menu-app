import { capitalizeFirstLetter } from '../../../utils/dataHelper'

interface Props {
   name: string
}

export default function MenuCategories({ name }: Props) {
   return (
      <>
         <div className='inline-block m-2.5 px-10 py-2.5'>
            <a href='#'>{capitalizeFirstLetter(name)}</a>
         </div>
      </>
   )
}
