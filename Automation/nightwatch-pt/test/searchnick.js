
module.exports = {
    '@tags': ['nickname'],

    'Fetch Nickname Test': function(browser) {
        const url = 'https://stage443.paltalk.com/people/webapp/index.wmt';
        browser.url(url);
        const nickname = browser.page.nicksearch();
        nickname.getMemberCardNick();
        browser.end();
    }
};
