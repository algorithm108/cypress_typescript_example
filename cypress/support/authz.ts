declare namespace Cypress {
    interface Chainable {
        login(username: string, password: string): void;

        assertElementsCountAsString(): Chainable<any>;

        assertElementsCountForItem(itemTitle: string): Chainable<any>;

        loadBillboardWithCategories(): Chainable<any>;

        getElementsLengthOnPage(): Chainable<any>;
    }
}

Cypress.Commands.add('login', (username, password) => {
    cy.get('#username').type(username);
    cy.get('#password').type(password, { log: false });
    cy.contains('Login').click();
})

Cypress.Commands.add('assertElementsCountAsString', () => {
    cy.get('.template-page').then(($page) => {
        if ($page.find('.woocommerce-pagination').length > 0) {
            let finalArray = [];
            cy.getElementsLengthOnPage().then((pageArray) => {
                finalArray = pageArray;

                cy.get('a[class = "page-numbers"]')
                    .not('.next')
                    .each(($el) => {
                            cy.wrap($el).click();

                            cy.getElementsLengthOnPage().then((pageArray) => {
                                finalArray = finalArray + pageArray
                            });
                        }
                    )
                cy.get('@itemText').then((itemText) => {
                    expect(itemText).equal(finalArray.toString());
                });
            });
        } else {
            cy.getElementsLengthOnPage().then((pageArray) => {
                cy.get('@itemText').then((itemText) => {
                    expect(itemText).equal(pageArray.toString());
                });
            });
        }
    });
});

Cypress.Commands.add('getElementsLengthOnPage', () => {
    let pageArray = [];
    cy.get('.products > li').then(($els) => {
        $els
            .toArray()
            .map((el) => el)
            .forEach((el) => {
                pageArray.push(el);
            });
        return pageArray.length;
    });
});

Cypress.Commands.add('assertElementsCountForItem', (itemTitle) => {
    cy.get(`.product-category:contains("${itemTitle}")`).as('group');

    cy.get('@group')
        .find('.count').then(($el) => {
        cy.wrap($el.text().replace(' Products', ''));
    })
        .as('itemText');

    cy.get('@group').click();
    cy.get('.products').should('exist');

    cy.get('@itemText').then(() => {
        cy.assertElementsCountAsString();
    });
});

Cypress.Commands.add('loadBillboardWithCategories', () => {
    cy.get('[title="Billboard"]').click();
    cy.get('.product-category').should('exist');
});