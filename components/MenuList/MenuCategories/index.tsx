interface Props {
   name: string
   capitalizeFirstString: (string: string) => string
}

export default function MenuCategories({ name, capitalizeFirstString }: Props) {
   return (
      <>
         <li className="inline-block m-2.5 px-10 py-2.5">
            <a href="#">{capitalizeFirstString(name)}</a>
         </li>
      </>
   )
}
