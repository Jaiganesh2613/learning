module.exports = {
    'Verify Room Name': function (browser) {
        const expectedRoomName = "Rishi's Room";

        browser
            .url('https://stage443.paltalk.com/g2/webapp/groups/GroupsPage.wmt')
            .pause(4000)
            .waitForElementVisible('#datepicker-input', 5000, 'Waiting for the date picker input to be visible')
            .click('#datepicker-input')
            .setValue('#datepicker-input', '09/04/2024')
            .assert.valueEquals('#datepicker-input', '09/04/2024', 'Verifying the selected date')

    }
};
