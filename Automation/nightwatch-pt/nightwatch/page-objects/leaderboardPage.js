module.exports = {
    url: 'https://stage443.paltalk.com/people/webapp/index.wmt',

    elements: {
        highestXpImage: {
            selector: 'img[src="/people/_next/static/media/highest_xp.03285e5d.svg"]',
            locateStrategy: 'css selector'
        },
        highestXpTitle: {
            selector: '.leaderboard_item__McaD1.leaderboard_highest_xp__rbygs .leaderboard_itemTitle__lgRfr',
            locateStrategy: 'css selector'
        },
        mostGiftedImage: {
            selector: 'img[src="/people/_next/static/media/most_gifted.f61c5b6f.svg"]',
            locateStrategy: 'css selector'
        },
        mostGiftedTitle: {
            selector: '.leaderboard_item__McaD1.leaderboard_most_gifted__zNQXC .leaderboard_itemTitle__lgRfr',
            locateStrategy: 'css selector'
        },
        biggestGifterImage: {
            selector: 'img[src="/people/_next/static/media/biggest_gifter.d0202283.svg"]',
            locateStrategy: 'css selector'
        },
        biggestGifterTitle: {
            selector: '.leaderboard_item__McaD1.leaderboard_biggest_gifter__UyWCn .leaderboard_itemTitle__lgRfr',
            locateStrategy: 'css selector'
        }
    },

    navigate: function() {
        return this.navigate(this.url);
    }
};
