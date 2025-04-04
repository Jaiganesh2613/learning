module.exports = {
    'Payment Form Test': function (browser) {
        browser
            .url('https://commerce.paltalk.com/mpt/ControllerServlet?RequestId=MyPalTalk.PalPlusSubscription&from=header&ref=mptupgrade')
            .pause(30000)
            .waitForElementVisible('body', 1000)
            .click('#upgradeMobileNudgeProfile')
            .click('#extremeSubscribe')
            // .click('#pricing-modal-mon-price')
            .pause(3000)
            .click('.button-container')
            // .frame('card-number-element')
            .waitForElementVisible('body',1000)
            .waitForElementVisible('div.CardNumberField-input-wrapper', 1000) // Wait for the container to be visible
            .setValue('div.CardNumberField-input-wrapper:nth-of-type(1) input[name="cardnumber"]', '4242 4242 4242 4242')
            .frameParent()

            .frame('card-expiry-element')
            .setValue('input', '12/34')
            .frameParent()

            .frame('card-cvc-element')
            .setValue('input', '123')
            .frameParent()

            .setValue('#first_name', 'John')
            .setValue('#last_name', 'Doe')

            .click('#State')
            .click('option[value="2"]')

            .click('button[type="submit"]')

            .end();
    }
};
