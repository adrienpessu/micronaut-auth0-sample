
Cypress.env()


describe('Nominal test', () => {
  it('passes', () => {
    cy.visit('http://localhost:8080');

    cy.get('body').then($body => {
      if ($body.find('a.enter').length) {
        cy.get('a.enter').click();

        cy.url({timeout: 35000}).then(url => {
          if (url.indexOf("state=") > -1) {
            cy.url({timeout: 35000}).should('contain', 'state=');
            cy.get('#username')
                .invoke('attr', 'value', Cypress.env('AUTH_USERNAME'),)
                .should('have.attr', 'value', Cypress.env('AUTH_USERNAME'),);
            cy.get('#password').invoke('attr', 'value', Cypress.env('AUTH_PASSWORD'),)
                .should('have.attr', 'value', Cypress.env('AUTH_PASSWORD'),)
            cy.get('button[type=submit][value=default]').click()
            cy.url({timeout: 35000}).should('contain', '8080')
          }
        })
      }
      cy.get('a.enter').click();
      cy.get('#name')
          .should('have.text',"cypress@pessu.net")
    });
  })
})
