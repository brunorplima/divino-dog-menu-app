import { capitalizeFirstLetter } from '../../../utils/dataHelper'

interface Props {
   readonly name: string
   readonly link: string
}

export default function MenuCategories({ name, link }: Props) {
   return (
      <div className='inline-block m-2.5 px-10 py-2.5' data-label={name.toLowerCase()}>
         <a href={`#${link}`}>{capitalizeFirstLetter(name)}</a>
      </div>
   )
}
