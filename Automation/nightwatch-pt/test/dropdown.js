module.exports = {
    'Select Gender from Dropdown': function (browser) {
        const page = browser.page.genderDropdown();

        browser
            .url('https://www.paltalk.com/people/webapp/index.wmt')
            .waitForElementVisible('body', 1000)
            .click('.peoplesearch_btn__Fh9Vw')

        // Select Male
        page
            .selectGender('Female')
            .getValue('@genderDropdown', function(result) {
                console.log('Selected Gender:', result.value);
                this.assert.equal(result.value, 'Male');
            });

        browser.end();
    },
};
