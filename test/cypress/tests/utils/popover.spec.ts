import Popover from '../../../../src/components/utils/popover';
import { PopoverItem } from '../../../../types';

/* eslint-disable @typescript-eslint/no-empty-function */

describe('Popover', () => {
  it('should support confirmation chains', () => {
    const actionIcon = 'Icon 1';
    const actionLabel = 'Action';
    const confirmActionIcon = 'Icon 2';
    const confirmActionLabel = 'Confirm action';

    /**
     * Confirmation is moved to separate variable to be able to test it's callback execution.
     * (Inside popover null value is set to confirmation property, so, object becomes unavailable otherwise)
     */
    const confirmation = {
      icon: confirmActionIcon,
      label: confirmActionLabel,
      onActivate: cy.stub(),
    };

    const items: PopoverItem[] = [
      {
        icon: actionIcon,
        label: actionLabel,
        name: 'testItem',
        confirmation,
      },
    ];

    const popover = new Popover({
      items,
      filterLabel: '',
      nothingFoundLabel: '',
      scopeElement: null,
    });

    cy.document().then(doc => {
      doc.body.append(popover.getElement());

      cy.get('[data-item-name=testItem]')
        .get('.ce-popover__item-icon')
        .should('have.text', actionIcon);

      cy.get('[data-item-name=testItem]')
        .get('.ce-popover__item-label')
        .should('have.text', actionLabel);

      // First click on item
      cy.get('[data-item-name=testItem]').click();

      // Check icon has changed
      cy.get('[data-item-name=testItem]')
        .get('.ce-popover__item-icon')
        .should('have.text', confirmActionIcon);

      // Check label has changed
      cy.get('[data-item-name=testItem]')
        .get('.ce-popover__item-label')
        .should('have.text', confirmActionLabel);

      // Second click
      cy.get('[data-item-name=testItem]')
        .click()
        .then(() => {
          // Check onActivate callback has been called
          expect(confirmation.onActivate).to.have.been.calledOnce;
        });
    });
  });

  it('should render the items with true isActive property value as active', () => {
    const items: PopoverItem[] = [
      {
        icon: 'Icon',
        label: 'Label',
        isActive: true,
        name: 'testItem',
        onActivate: (): void => {},
      },
    ];

    const popover = new Popover({
      items,
      filterLabel: '',
      nothingFoundLabel: '',
      scopeElement: null,
    });

    cy.document().then(doc => {
      doc.body.append(popover.getElement());

      /* Check item has active class */
      cy.get('[data-item-name=testItem]')
        .should('have.class', 'ce-popover__item--active');
    });
  });

  it('should not execute item\'s onActivate callback if the item is disabled', () => {
    const items: PopoverItem[] = [
      {
        icon: 'Icon',
        label: 'Label',
        isDisabled: true,
        name: 'testItem',
        onActivate: cy.stub(),
      },
    ];

    const popover = new Popover({
      items,
      filterLabel: '',
      nothingFoundLabel: '',
      scopeElement: null,
    });

    cy.document().then(doc => {
      doc.body.append(popover.getElement());

      /* Check item has disabled class */
      cy.get('[data-item-name=testItem]')
        .should('have.class', 'ce-popover__item--disabled')
        .click()
        .then(() => {
          // Check onActivate callback has never been called
          expect(items[0].onActivate).to.have.not.been.called;
        });
    });
  });

  it('should close once item with closeOnActivate property set to true is activated', () => {
    const items: PopoverItem[] = [
      {
        icon: 'Icon',
        label: 'Label',
        closeOnActivate: true,
        name: 'testItem',
        onActivate: (): void => {},
      },
    ];
    const popover = new Popover({
      items,
      filterLabel: '',
      nothingFoundLabel: '',
      scopeElement: null,
    });

    cy.spy(popover, 'hide');

    cy.document().then(doc => {
      doc.body.append(popover.getElement());

      cy.get('[data-item-name=testItem]')
        .click()
        .then(() => {
          expect(popover.hide).to.have.been.called;
        });
    });
  });

  it('should highlight as active the item with toggle property set to true once activated', () => {
    const items: PopoverItem[] = [
      {
        icon: 'Icon',
        label: 'Label',
        toggle: true,
        name: 'testItem',
        onActivate: (): void => {},
      },
    ];
    const popover = new Popover({
      items,
      filterLabel: '',
      nothingFoundLabel: '',
      scopeElement: null,
    });

    cy.document().then(doc => {
      doc.body.append(popover.getElement());

      /* Check item has active class */
      cy.get('[data-item-name=testItem]')
        .click()
        .should('have.class', 'ce-popover__item--active');
    });
  });
});
