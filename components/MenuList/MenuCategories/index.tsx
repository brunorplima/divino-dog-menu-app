interface Props {
   name: string
   capitalizeFirstString: (string: string) => string
}

export default function MenuCategories({ name, capitalizeFirstString }: Props) {
   return (
      <>
         <li>
            <a href="#">{capitalizeFirstString(name)}</a>
         </li>
      </>
   )
}
