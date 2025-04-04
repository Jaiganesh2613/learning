module.exports = {
    url: 'https://stage443.paltalk.com/people/webapp/index.wmt',
    elements: {
        genderDropdown: '#dd_gender',
        genderOptions: 'div[role="listbox"]',
        membersProfile: '.members_asl__HM3fa'
    },
    commands: [{
        selectGender(option) {
            console.log(`Selecting option: ${option}`);
            const self = this; // Preserve Nightwatch.js context

            self
                .click('@genderDropdown')
                .waitForElementVisible('@genderOptions', 5000)
                .useXpath()
                .click(`//div[@role="option" and text()="${option}"]`)
                .useCss()
                .waitForElementVisible('@membersProfile', 5000);

            const expectedText = option === 'Male' ? 'M' :
                option === 'Female' ? 'F' :
                    option === 'All Genders' ? 'M/F' : '';
            self.api.elements('css selector','@membersProfile', function(result) {
                console.log(result.value);
                let allContainExpected = true;

                result.value.forEach(function(element) {
                    const elementId = element['element-6066-11e4-a52e-4f735466cecf'];
                    self.api.elementIdText(elementId, function(textResult) {
                        const text = textResult.value.trim().toUpperCase();
                        console.log('Profile text:', text);

                        // Check if the text contains the expected text ('M' or 'F')
                        if (!text.includes(expectedText)) {
                            allContainExpected = false;
                        }
                    });
                });

                self.api.perform(function() {
                    if (allContainExpected) {
                        browser.assert.ok(`All elements contain "${expectedText}" in Member Details.`);
                        console.log(`All elements contain "${expectedText}" in Member Details.`);
                    } else {
                        console.log(`Not all elements contain "${expectedText}" in Member Details.`);
                    }
                });
            });

            return self;
        },
    }],
};
