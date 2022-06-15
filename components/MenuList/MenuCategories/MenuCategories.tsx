import { capitalizeFirstLetter } from '../../../utils/dataHelper'

interface Props {
   name: string
}

export default function MenuCategories({ name }: Props) {
   return (
      <>
         <div className='inline-block mx-10 my-2.5'>
            <a href='#'>{capitalizeFirstLetter(name)}</a>
         </div>
      </>
   )
}
