import HomePage from "../pages/HomePage";
import SearchPage from "../pages/SearchPage";


describe("Automation flows for airbnb website", () => {

    const homepage = new HomePage();
    const searchPage = new SearchPage();

    beforeEach(() => {
        homepage.visit();
    });

    it('Verify that the results match the search criteria', () => {

        homepage.checkElementsVisibility();
        homepage.selectLocation('Italy');
        homepage.selectCheckInDate();
        homepage.getCheckInOutDate();
        homepage.selectNumberOfGuests(2, 1);
        homepage.clickOnSearchBtn();
        searchPage.clickDatePicker();
        searchPage.verifySearchResults();
        searchPage.retrieveSearchResults('3 guests');

    });

    it('Verify that the results and details page match the extra filters', () => {

        homepage.checkElementsVisibility();
        homepage.selectLocation('Italy');
        homepage.selectCheckInDate();
        homepage.selectNumberOfGuests(2, 1);
        homepage.clickOnSearchBtn();
        searchPage.clickMoreFilterButton();
        searchPage.selectNumberOfBeds(5);
        searchPage.selectFacilities();
        searchPage.clickShowStayButton();
        searchPage.retrieveSearchResults('5 bedrooms')
       /*Open the details of the first property.
        Check that in the Amenities popup Pool is displayed under Facilities category
        ----> The above steps could not be implemented, due to the limitation of the Cypress that don't allow multiple tabs to be opened,
        i should avoid this, from the beginning but when i saw,it was too late to be accomplished in the 1 week timeline. <----
        */
    });

    it('Test: Verify that a property is displayed on the map correctly', () => {

        homepage.checkElementsVisibility();
        homepage.selectLocation('Italy');
        homepage.selectCheckInDate();
        homepage.getCheckInOutDate();
        homepage.selectNumberOfGuests(2, 1);
        homepage.clickOnSearchBtn();
        searchPage.clickDatePicker();
        searchPage.verifySearchResults();
        searchPage.clickMoreFilterButton();
        searchPage.selectNumberOfBeds(5);
        searchPage.clickShowStayButton();
        searchPage.verifyPropertyColorChangeWhenHover();
        searchPage.verifyDetailsPropertyMapPopUp();

    });
});
