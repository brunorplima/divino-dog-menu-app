export const priceToString = (price: number, addDeciaml = true) => {
   return `$ ${addDeciaml ? price.toFixed(2) : price.toFixed(0)}`
}
