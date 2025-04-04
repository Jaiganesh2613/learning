module.exports = {
    elements: {
        premiumCheckboxInput: '.mantine-Checkbox-input',
        spanBadgeVip: '.badge-vip',
        spanBadgePrime: '.badge-prime',
        spanBadgeExtreme: '.badge-extreme',
    },
    commands: [{
        clickPremiumCheckbox() {
            return this
                .waitForElementVisible('@premiumCheckboxInput', 5000)
                .click('@premiumCheckboxInput')
                .pause(5000);
        },
        verifyCheckboxChecked() {
            return this
                .waitForElementVisible('@premiumCheckboxInput', 5000)
                .assert.attributeEquals('@premiumCheckboxInput', 'checked', 'true');
        },
        verifyCheckboxUnchecked() {
            return this
                .waitForElementVisible('@premiumCheckboxInput', 5000)
                .assert.not.attributeContains('@premiumCheckboxInput', 'checked', 'true');
        },
        verifyOneOfSpanBadgesVisible() {
            return this
                .waitForElementVisible('body', 1000)
                .execute(function() {
                    const badges = document.querySelectorAll('.badge-vip, .badge-prime, .badge-extreme');
                    for (let badge of badges) {
                        if (badge.offsetParent !== null) {
                            return true;
                        }
                    }
                    return false;
                }, [], function(result) {
                    this.assert.ok(result.value, 'Expected one of the badges to be visible');
                });
        }
    }]
};
