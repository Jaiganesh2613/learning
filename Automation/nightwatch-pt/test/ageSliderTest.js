const slackConfig = require("../utils/slack-config");
const { EventEmitter } = require('events');

module.exports = {
    'Test Age Slider': function(browser) {
        const ageSliderPage = browser.page.ageSlider();

        browser
            .url('https://stage443.paltalk.com/people/webapp/index.wmt')
            .waitForElementVisible('body', 1000);

        ageSliderPage
            .setAgeRange(18, 50)
            .pause(5000)
            .waitForElementVisible('.members_asl__HM3fa')
            .elements('css selector', '.members_asl__HM3fa', function(result) {
                result.value.forEach(function(element) {
                    const elementId = element['element-6066-11e4-a52e-4f735466cecf'];
                    browser.elementIdText(elementId, function(textResult) {
                        const ageText = textResult.value.trim();

                        // Extract the age using a regex pattern
                        const ageRegex = /[MF]?(\d+)/;
                        const match = ageText.match(ageRegex);

                        if (match && match[1]) {
                            const age = parseInt(match[1]);
                            console.log('Age:', age);

                            const expectedMinAge = 18;
                            const expectedMaxAge = 50;

                            if (age >= expectedMinAge && age <= expectedMaxAge) {
                                console.log(`Age "${age}" is within the expected range [${expectedMinAge}-${expectedMaxAge}].`);
                            } else {
                                console.error(`Age "${age}" is not within the expected range [${expectedMinAge}-${expectedMaxAge}].`);
                            }

                            browser.assert.ok(age >= expectedMinAge && age <= expectedMaxAge, `Age "${age}" should be within the expected range [${expectedMinAge}-${expectedMaxAge}].`);
                        } else {
                            console.error(`Invalid age text: "${ageText}". Unable to extract valid age.`);
                        }
                    });
                });
            });

        browser.end();
    }
};
