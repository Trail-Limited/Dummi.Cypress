import dayjs from "dayjs"
/**
 * Utility function to compute a future date from today for the given number of days.
 * @param numberOfDays - integer representing number of days
 * @returns {string} - computed future date as string based on the given parameter
 */

export const computeFutureDateFromToday = (numberOfDays) => {
    return dayjs().add(numberOfDays, 'day').endOf('day').format('MMMM D, YYYY');
};

/**
 * Utility function to click multiple times on a specific element
 * @param element - selector that the click action will be made
 * @param clickAction - the number of clicks
 */
export const clickButtonMultipleTimes = (element,clickAction) => {
    for (let n = 0; n < clickAction; n++) {
        cy.xpath(element).click()
    }
};
