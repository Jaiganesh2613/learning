module.exports = {
    'Verify Highest XP Image and Title are Present': function (browser) {
        const leaderboardPage = browser.page.leaderboardPage();

        leaderboardPage
            .navigate()
            .waitForElementVisible('@highestXpImage', 5000)
            .assert.attributeContains('@highestXpImage', 'src', '/people/_next/static/media/highest_xp.03285e5d.svg')
            .waitForElementVisible('@highestXpTitle', 5000)
            .assert.textContains('@highestXpTitle', 'HIGHEST XP');

        browser.end();
    },

    'Verify Most Gifted Image and Title are Present': function (browser) {
        const leaderboardPage = browser.page.leaderboardPage();

        leaderboardPage
            .navigate()
            .waitForElementVisible('@mostGiftedImage', 5000)
            .assert.attributeContains('@mostGiftedImage', 'src', '/people/_next/static/media/most_gifted.f61c5b6f.svg')
            .waitForElementVisible('@mostGiftedTitle', 5000)
            .assert.textContains('@mostGiftedTitle', 'MOST GIFTED');

        browser.end();
    },

    'Verify Biggest Gifter Image and Title are Present': function (browser) {
        const leaderboardPage = browser.page.leaderboardPage();

        leaderboardPage
            .navigate()
            .waitForElementVisible('@biggestGifterImage', 5000)
            .assert.attributeContains('@biggestGifterImage', 'src', '/people/_next/static/media/biggest_gifter.d0202283.svg')
            .waitForElementVisible('@biggestGifterTitle', 5000)
            .assert.textContains('@biggestGifterTitle', 'BIGGEST GIFTER');

        browser.end();
    }
};
