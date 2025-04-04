module.exports = {
    'Test Premium Checkbox': function(browser) {
        const premiumCheckboxPage = browser.page.premiumCheckbox();

        browser
            .url('https://www.paltalk.com/people/webapp/index.wmt')
            .waitForElementVisible('body', 1000);

        premiumCheckboxPage
            .clickPremiumCheckbox()
            .verifyCheckboxChecked()
            .verifyOneOfSpanBadgesVisible()
            .clickPremiumCheckbox()
            .verifyCheckboxUnchecked();

        browser.end();
    }
};
