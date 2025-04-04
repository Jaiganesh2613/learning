module.exports = {
    'Test Clear Filters Button': function(browser) {
        const clearFiltersButtonPage = browser.page.clearFiltersButton();

        browser
            .url('https://www.paltalk.com/people/webapp/index.wmt')  // Replace with the actual URL
            .waitForElementVisible('body', 1000);

        // Click the Clear Filters button
        clearFiltersButtonPage
            .clickClearFiltersButton();

        browser.end();
    }
};
