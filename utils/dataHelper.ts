export const priceToString = (price: number, withDecimal = true) => {
   return `$ ${withDecimal ? price.toFixed(2) : price.toFixed(0)}`
}
