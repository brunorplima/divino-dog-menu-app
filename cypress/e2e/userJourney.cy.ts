/// <reference types="cypress" />

import {
   numberToArray,
   categoriesList,
   categoriesListLength,
   itemsPageRepeater,
   textPriceToFloat,
} from './functions/functions'

describe('User journey', () => {
   before('Getting to homepage', () => {
      cy.visit('/')
   })

   it('Placing an order', () => {
      context('Selecting items to place the order', () => {
         categoriesListLength().then((length) => {
            // this array will be used as an index to pass through each product category
            const len = numberToArray(length)

            len.forEach((num) => {
               // this function find each category and then all products bellow it
               categoriesList().then(($categories) => {
                  cy.wrap($categories)
                     .eq(num)
                     .find('[data-label^="menu-item-"]')
                     // removes products listed bellow each category but are not available
                     .not('[class^="Listing_lineThrough"]')
                     .first()
                     .click()

                  cy.url().should('include', '/item')

                  cy.get('[class^="AddOns_topAddons"]').then(($element) => {
                     // this text defines the characteristics of the page
                     // and how the test should behave in each scenario
                     // there are three possible scenarios
                     const content = $element.text()

                     // first possible scenario is the one in which the user can choose multiple toppings
                     // user can add toppings but with the limitation the page informs the user
                     if (content.startsWith('Escolha seus Adicionais')) {
                        cy.get('[class="pt-4 font-semibold"]')
                           .contains(/(Somente|Até) (\d+) adiciona(l|is) permitidos?/)
                           // "$text" contains the string that matches the regex above
                           .then(($text) => {
                              // it gets the list that contains the data-label thats starts with "item-"
                              // then selects only the ones that contains the input tag
                              // these tags are the ones that contains the toppings user can add
                              cy.getDataLabel('^item-')
                                 .get('input')
                                 .then(($checkboxes) => {
                                    // max amount of toppings allowed to choose
                                    const limit = parseInt($text.text().match(/\d\d?\d?/)[0], 10)

                                    // total topping checkboxes available
                                    const opts = $checkboxes.length

                                    // array to use as an index to iterate over the available toppings
                                    // its length is limited by the smallest between "limit" and "opts"
                                    // when "limit" is smaller, it creates an array with "limit + 1" elements
                                    // this is necessary to test an alert that prevents the user from
                                    // choosing more toppings than the maximum allowed
                                    const repeater = numberToArray(opts <= limit ? opts : limit + 1)

                                    // choosing the toppings based in the array
                                    repeater.forEach((rep) => {
                                       cy.getDataLabel('^item-').eq(rep).click()
                                    })

                                    // when the max amount of toppings is smaller then the checkboxes available
                                    // and the user try to choose another item beyond the that max amount
                                    // an alert notifies the user can't choose another topping
                                    opts > limit && cy.getDataLabel('button-close').click()

                                    // procedure repeated in all tests / see functions.ts
                                    itemsPageRepeater()
                                 })
                           })
                     }
                     // this is the second scenario
                     // in this scenario only one topping can be chosen
                     else if (content.startsWith('Escolha sua Opção')) {
                        cy.getDataLabel('^item-')
                           .get('input')
                           .then(($checkboxes) => {
                              if ($checkboxes.length >= 2) {
                                 cy.getDataLabel('^item-').eq(0).click()
                                 cy.getDataLabel('^item-').eq(1).click()
                              } else {
                                 cy.getDataLabel('^item-').eq(0).click()
                              }
                           })

                        // procedure repeated in all tests / see functions.ts
                        itemsPageRepeater()
                     }
                     // this is the third scenario
                     // this scenario represents the situation in which there is no toppings available
                     else {
                        // procedure repeated in all tests / see functions.ts
                        itemsPageRepeater()
                     }
                  })
               })
            })
         })
         // it gets the user to the page where user's requests are placed
         cy.getDataLabel('nav-order').click()
      })

      context('Checking if order matches the selected items', () => {
         cy.url().should('include', '/checkout')

         // alias to price comparison after the order is indeed placed
         // this alias is going to be used in the next context
         cy.get('[class="fixed flex justify-between gap-3 font-semibold mt-12"]')
            .children()
            .last()
            .then(($priceTag) => {
               cy.wrap(textPriceToFloat($priceTag.text())).as('price')
            })

         // only checking this button
         cy.getDataLabel('delete-all-items').click()
         cy.getDataLabel('button-no').click()
         cy.getDataLabel('confirm-order').click()
      })

      context("Final verifications in the user's order", () => {
         cy.url().should('include', '/track_order')

         // the page opens a message alerting the user must pay the order
         cy.get('[class="max-w-lg bg-gray-600 border-2 border-gray-200 opacity-100 mx-9 rounded"]')
            .find('[class="p-5"]')
            .should('have.text', 'Para confirmar seu pedido é preciso realizar o pagamento')
         cy.getDataLabel('button-ok').click()

         // confirming the text user sees requesting his payment
         cy.get('[class="text-2xl text-green-500 mb-3 flex gap-3 cursor-pointer"]')
            .last()
            .should('have.text', 'Pedido não confirmado')

         // order price registered to compare with alias @price and check if they are equal
         cy.get('[class="mt-4 font-bold"]').then(($priceTag) => {
            const price = textPriceToFloat($priceTag.text())

            // capture alias @price to compare to
            cy.get('@price').then((p) => {
               cy.wrap(price).should('eq', p)
            })
         })
      })

      // testing the button that open the front page and checking the URL
      cy.getDataLabel('nav-menu').click()
      cy.url().should('deep.equal', Cypress.config().baseUrl + '/')
   })
})
