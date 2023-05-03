declare namespace Cypress {
   interface Chainable<Subject = any> {
      getDataLabel(selector: string): Chainable<JQuery>
      listDataLabel(selector: string): Chainable<JQuery>
   }
}
