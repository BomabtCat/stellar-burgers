/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add('loginByApi', () => {
  // First try to create a test user
  cy.request({
    method: 'POST',
    url: `${Cypress.env('API_URL')}/auth/register`,
    failOnStatusCode: false,
    body: {
      email: Cypress.env('TEST_USER_EMAIL'),
      password: Cypress.env('TEST_USER_PASSWORD'),
      name: 'Test User'
    }
  }).then(() => {
    // Then login with these credentials
    cy.request({
      method: 'POST',
      url: `${Cypress.env('API_URL')}/auth/login`,
      body: {
        email: Cypress.env('TEST_USER_EMAIL'),
        password: Cypress.env('TEST_USER_PASSWORD')
      }
    }).then((response) => {
      const { accessToken, refreshToken } = response.body;
      cy.setCookie('accessToken', accessToken);
      window.localStorage.setItem('refreshToken', refreshToken);
    });
  });
});