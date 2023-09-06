import {computeFutureDateFromToday} from "../helpers/dateUtils";

export default class HomePage {

    PAGE_TITLE = 'Vacation Rentals, Homes, Experiences & Places - Airbnb';
    LOGO = '//a[@class="_gpuobnr"]';
    TODAY_PlUS_7_DAYS = '//td[contains(@class, "_12fun97") and contains(@aria-label,"' + computeFutureDateFromToday(7) + '")]';
    TODAY_PlUS_14_DAYS = '//td[contains(@class, "_12fun97") and contains(@aria-label,"' + computeFutureDateFromToday(14) + '")]';
    MORE_FILTERS_GUESTS_BTN = '//div[@class="_9bj9d5" and text()="Guests"]';
    MORE_FILTERS_ADULTS_BTN = '#stepper-adults > [aria-label="increase value"]';
    MORE_FILTERS_CHILDREN_BTN = '#stepper-children > [aria-label="increase value"]';
    SEARCH_BTN = '._m9v25n';
    LOCATION_INPUT = '#bigsearch-query-attached-query';
    CHOOSE_LOCATION_LIST_BOX = '#Koan-query__option-0 > ._6liiy8';
    CHECK_IN_CHECK_OUT_DATE = '._1v1onhz';


    MAIN_ELEMENTS = [
        this.LOGO,

    ];

    visit = () => {
        cy.visit('https://airbnb.com');

    };

    checkElementsVisibility = () => {
        this.MAIN_ELEMENTS.forEach(element => {
            cy.xpath(element).should("be.visible");
        });

        cy.title().should("equal", this.PAGE_TITLE);

    };
    /**
     * Function for selecting location on HomePage
     * @param location - string representing location
     */
    selectLocation = (location) => {
        cy.get(this.LOCATION_INPUT).type(location);
        cy.wait(2000);
        cy.get(this.CHOOSE_LOCATION_LIST_BOX).click({force: true});

    };

    selectCheckInDate = () => {
        cy.xpath(this.TODAY_PlUS_7_DAYS).click();
        cy.xpath(this.TODAY_PlUS_14_DAYS).click();

    };
    /**
     * Function for choosing the number of adults and children used in more filters pop-up
     * @param adults - string representing the number of adults
     * @param children - string representing the number of children's
     */
    selectNumberOfGuests = (adults, children) => {
        cy.xpath(this.MORE_FILTERS_GUESTS_BTN).click();
        cy.get(this.MORE_FILTERS_ADULTS_BTN).dblclick(adults);
        cy.get(this.MORE_FILTERS_CHILDREN_BTN).click(children);

    };

    clickOnSearchBtn = () => {
        cy.get(this.SEARCH_BTN).click();

    };

    getCheckInOutDate = () => {
        cy.get(this.CHECK_IN_CHECK_OUT_DATE).should(($div) => {
            const text = $div.text();
            expect(text).to.equal(text);

        })
    };
}
