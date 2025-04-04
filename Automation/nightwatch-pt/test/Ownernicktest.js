module.exports = {
    'Verify Leaderboard Nicknames': function (browser) {
        const leaderboardPage = browser.page.ownernickname();

        leaderboardPage
            .navigate()
            .waitForElementVisible('@biggestGifterNickname', 5000)
            .getText('@biggestGifterNickname', function(result) {
                const nickname = result.value;
                console.log('Biggest Gifter Nickname:', nickname);
                leaderboardPage.click('@biggestGifterNickname');
            });

        browser.end();
    }
};
