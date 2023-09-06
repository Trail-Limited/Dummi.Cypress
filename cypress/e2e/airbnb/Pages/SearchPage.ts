import {clickButtonMultipleTimes} from "../helpers/dateUtils";

export default class SearchPage {

    SEARCH_RESULTS = '//button[@class="_v46alp4"]//div[@class="_1v1onhz"]';
    ITEM_LIST = '//div[@class="_1ulsev2" and contains(., "guests") and contains(., "bedroom")]';
    DATE_PICKER = '//button[@class="_37g0dr4" and @data-index="1"]';
    DATE_PICKER_CLOSE_BTN = '//div[@class="_zmzx9g"]//button';
    MORE_FILTER_BTN = '#menuItemButton-dynamicMoreFilters > ._1wc4ltr';
    BEDROOMS_BTN = '//button[@aria-label="increase value" and @aria-describedby="subtitle-label-filterItem-stepper-min_bedrooms-0"]';
    POOL_CHECKBOX = '//label[@for="filterItem-checkbox-amenities-7"]//span[@class="_foa2bi"]//span[@class="_167krry"]';
    SHOW_STAY_BTN = '._2i58o3a';
    HOVER_FIRST_PROPERTY = '//a[@target="listing_3682863" and @rel="noopener noreferrer"]';
    PIN_PROPERTY_MAP = '//div[contains(@style,"background-color: rgb(34, 34, 34)")]';
    PIN_POP_UP_PROPERTY_NAME = '//div[@class="_byy3lf"]//a[@aria-label="XIII Century Tower with Private Panoramic Pool" and @aria-hidden="true"]';

    SEARCH_RESULTS_ELEMENTS = [
        this.ITEM_LIST,

    ];

    clickDatePicker = () => {
        cy.xpath(this.DATE_PICKER).click();

    };

    verifySearchResults = () => {
        cy.xpath(this.SEARCH_RESULTS).invoke("text");
        cy.xpath(this.DATE_PICKER_CLOSE_BTN).click();

    };

    retrieveSearchResults = (value) => {
        this.SEARCH_RESULTS_ELEMENTS.forEach(element => {
        cy.xpath(element).should('contain', value);

        })
    };

    clickMoreFilterButton = () => {
        cy.get(this.MORE_FILTER_BTN).click();

    };

    /**
     *
     * @param numberOfBeds
     */
    selectNumberOfBeds = (numberOfBeds) => {
        clickButtonMultipleTimes(this.BEDROOMS_BTN, numberOfBeds);

    };

    selectFacilities = () => {
        cy.xpath(this.POOL_CHECKBOX).scrollIntoView().click();

    };

    clickShowStayButton = () => {
        cy.get(this.SHOW_STAY_BTN).click();

    };

    verifyPropertyColorChangeWhenHover = () => {
        cy.xpath(this.HOVER_FIRST_PROPERTY).trigger('mouseover');
        cy.xpath(this.PIN_PROPERTY_MAP).should('have.css', 'background-color', 'rgb(34, 34, 34)');

    };

    verifyDetailsPropertyMapPopUp = () => {
        cy.xpath(this.PIN_PROPERTY_MAP).click();
        cy.xpath(this.PIN_POP_UP_PROPERTY_NAME).invoke('attr', 'aria-label').should('equal', 'XIII Century Tower with Private Panoramic Pool');

    };
}

