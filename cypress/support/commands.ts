/// <reference types="cypress" />

Cypress.Commands.add('getDataLabel', (selector, ...args) => {
   if (selector.startsWith('^')) {
      return cy.get(`[data-label^="${selector.replace('^', '')}"]`, ...args)
   }
   return cy.get(`[data-label="${selector}"]`, ...args)
})

Cypress.Commands.add('listDataLabel', (selector, ...args) => {
   if (selector.startsWith('^')) {
      return cy.get(`[data-label^="${selector.replace('^', '')}"]`, ...args)
   }
})
