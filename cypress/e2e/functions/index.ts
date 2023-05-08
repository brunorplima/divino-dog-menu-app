// creates an array from 0 to n [0, 1, 2, ..., n-1]
// array has length of n
export function numberToArray(n: number): number[] {
   const arr = []
   for (let i = 0; i <= n - 1; i++) {
      arr.push(i)
   }
   return arr
}

// to avoid calling the same code repeatedly
export function categoriesList(): Cypress.Chainable<JQuery<HTMLElement>> {
   return cy.get('[id]').find('h2').parent()
}

// one products of each category will be added to the order
// and categories are change all the time
export function categoriesListLength(): Cypress.Chainable<number> {
   return categoriesList().then((categories) => {
      const length = categories.length
      return length
   })
}

// to avoid calling the same code repeatedly
export function itemsPageRepeater(): void {
   cy.getDataLabel('item-upwards').click()
   cy.getDataLabel('send-order').click()
   cy.url().should('deep.equal', Cypress.config().baseUrl + '/')
}

export function textPriceToFloat(str: string): number {
   return parseFloat(str.replace(',', '.').match(/\d\d?\d?\d?\.\d\d/)[0])
}
