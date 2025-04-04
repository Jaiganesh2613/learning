module.exports = {
    url: 'https://stage443.paltalk.com/people/webapp/index.wmt',

    elements: {
        highestXpNickname: {
            selector: '.leaderboard_item__McaD1.leaderboard_highest_xp__rbygs .leaderboard_nickname__Z3Swf',
            locateStrategy: 'css selector'
        },
        mostGiftedNickname: {
            selector: '.leaderboard_item__McaD1.leaderboard_most_gifted__zNQXC .leaderboard_nickname__Z3Swf',
            locateStrategy: 'css selector'
        },
        biggestGifterNickname: {
            selector: '.leaderboard_item__McaD1.leaderboard_biggest_gifter__UyWCn .leaderboard_nickname__Z3Swf',
            locateStrategy: 'css selector'
        }
    },

    navigate: function() {
        return this.navigate(this.url);
    }
};
