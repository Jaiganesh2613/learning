const config = require('../config.js');
const environment = process.env.NODE_ENV || 'prod';
const envConfig = config[environment]();
module.exports = {
    'rewards page check': function (browser) {
        const rewardsObj = browser.page.rewardsobj();
        const dateInputSelector = '#datepicker-input';
        const dateToSet = '27/06/1984';
        rewardsObj
            .navigate()
            .waitForElementVisible('body', 5000)
            .waitForElementVisible('@loginWithNick', 2000, 'new auth screen displayed')
            .click('@loginWithNick')
            .waitForElementVisible('@formGroup', 2000, 'screen displayed for login')
            .waitForElementVisible('@nicknameInput', 2000)
            .setValue('@nicknameInput', envConfig.username)
            .waitForElementVisible('@passwordInput', 2000)
            .setValue('@passwordInput', envConfig.password)
            .pause(5000)
            .saveScreenshot('new auth screen displayed.png')
            .click('@loginButton')
            .pause(10000)
            .saveScreenshot('screenshots/after_login.png');
        //
        // browser
        //     .navigateTo(envConfig.getRewardPageUrl())
        //     .assert.urlContains(envConfig.getRewardPageUrl(), "Rewards Page URL Verified")
        //     .waitForElementVisible('body', 5000)
        //     .assert.visible(rewardsObj.elements.signOutButton.selector, 'Sign Out button is visible')
        //     .pause(5000)
        //     .saveScreenshot('screenshots/Rewards_Page.png')
        //     .waitForElementVisible(rewardsObj.elements.dashboardHeader.selector, 2000, 'Your Rewards Dashboard is visible')
        //     .waitForElementVisible(rewardsObj.elements.bannerRewardsBanner.selector, 2000, 'Points Section is visible')
        //     .waitForElementVisible(rewardsObj.elements.getRewardsButton.selector, 2000, 'Get Paltalk Rewards Section is visible')
        //     .execute(function() {
        //         document.querySelector('.dailyStreaks_dailyStreaks__NsIJV').scrollIntoView();
        //     })
        //     .waitForElementVisible(rewardsObj.elements.dailyStreaks.selector, 2000, 'Daily Streak Mission is visible')
        //     .pause(5000)
        //     .saveScreenshot('screenshots/Daily_Streak_Mission.png');
        //
        // // Check if 'Rewards Points History' is available
        // browser.elements('css selector', rewardsObj.elements.pointsHistory.selector, function (result) {
        //     if (result.value.length > 0) {
        //         browser
        //             .waitForElementVisible(rewardsObj.elements.pointsHistory.selector, 2000, 'Rewards Points History\n')
        //             .execute(function() {
        //                 document.querySelector('.pointsHistory_pointsHistory__VoR_i').scrollIntoView();
        //             })
        //             .pause(5000)
        //             .saveScreenshot('screenshots/Rewards_Points_History.png')
        //             .waitForElementVisible(rewardsObj.elements.rewardsHistory.selector, 5000, 'Rewards History');
        //     }
        // });
        //
        // // Check if the 'View More' button is available and click it
        // browser.elements('css selector', rewardsObj.elements.pointsHistoryFooterButton.selector, function (result) {
        //     if (result.value.length > 0) {
        //         browser
        //             .execute(function() {
        //                 document.querySelector('.pointsHistory_footer__UWr8N .btn.bluebtn').click();
        //             })
        //             .pause(5000)
        //     }
        // });
        //
        // browser
        //     .execute(function() {
        //         document.querySelector('.rewardsHistory_rewardsHistory__uFLeR').scrollIntoView();
        //     })
        //     .pause(5000)
        //     .saveScreenshot('screenshots/Rewards_History.png')
            // .waitForElementVisible('.pointsHistory_footer__UWr8N .btn.bluebtn', 2000)
            // .scrollToElement('.pointsHistory_footer__UWr8N .btn.bluebtn')
            // .pause(5000)
            // .saveScreenshot('screenshots/view_more_btn.png')
            // .click('.pointsHistory_footer__UWr8N .btn.bluebtn')
            // .pause(5000)
            browser.navigateTo('https://stage443.paltalk.com/mpt/ControllerServlet?RequestId=MyPalTalk.EditProfile')
            .waitForElementVisible('body', 1000)
                .click('#editProfile')
                .waitForElementVisible(dateInputSelector, 5000)
                .execute(function() {
                    document.querySelector('#datepicker-input').removeAttribute('readonly');
                })
                .pause(5000)
                .setValue(dateInputSelector, dateToSet)
                .pause(5000)
                .click('#datepicker-container button.ui-datepicker-trigger')
                .pause(5000)
                .assert.valueContains(dateInputSelector, dateToSet)
        browser.end();
    }
};
