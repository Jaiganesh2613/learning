module.exports = {
    'Test Country Dropdown': function(browser) {
        const countryDropdownPage = browser.page.countryDropdown();

        browser
            .url('https://www.paltalk.com/people/webapp/index.wmt')
            .waitForElementVisible('body', 1000);

        countryDropdownPage
            .selectCountry('Somalia')
            .pause(5000)
            .waitForElementVisible('.members_asl__HM3fa')
            .elements('css selector', '.members_asl__HM3fa', function(result) {
                result.value.forEach(function(element) {
                    const elementId = element['element-6066-11e4-a52e-4f735466cecf'];
                    browser.elementIdText(elementId, function(textResult) {
                        const countryText = textResult.value;
                        console.log('Country:', countryText);

                        const expectedCountryCode = 'SO';
                        if (countryText.includes(expectedCountryCode)) {
                            console.log(`Country "${countryText}" contains the expected country code "${expectedCountryCode}".`);
                        } else {
                            console.error(`Country "${countryText}" does not contain the expected country code "${expectedCountryCode}".`);
                        }

                        // Assertion Example:
                        browser.assert.ok(countryText.includes(expectedCountryCode), `Country "${countryText}" should contain the expected country code "${expectedCountryCode}".`);
                    });
                });
            });

        browser.end();
    }
};
