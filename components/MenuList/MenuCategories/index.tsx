interface Props {
   name: string
   capitalize: (string: string) => string
}

export default function MenuCategories({ name, capitalize }: Props) {
   return (
      <>
         <li>
            <a href="#">{capitalize(name)}</a>
         </li>
      </>
   )
}
