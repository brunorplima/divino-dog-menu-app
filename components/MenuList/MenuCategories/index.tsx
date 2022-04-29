interface Props {
   name: string
   capitalizeFirstLetter: (word: string) => string
}

export default function MenuCategories({ name, capitalizeFirstLetter }: Props) {
   return (
      <>
         <div className="inline-block m-2.5 px-10 py-2.5">
            <a href="#">{capitalizeFirstLetter(name)}</a>
         </div>
      </>
   )
}
