export const priceToString = (price: number, withDecimal = true) => {
   return `$ ${withDecimal ? price.toFixed(2) : price.toFixed(0)}`
}

export const fotmatPrice = (unformatted: number | undefined) => {
   if (unformatted !== undefined) {
      if (String(unformatted).includes('.'))
         return `R$ ${String(unformatted).replace('.', ',')}${
            String(unformatted).split('.')[1].length === 1 ? 0 : ''
         }`
      else return `R$ ${unformatted},00`
   }
}
