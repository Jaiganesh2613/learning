module.exports = {
    elements: {
        memberCardNick: {
            selector: '#member-card-nick',
            locateStrategy: 'css selector'
        }
    },

    commands: [{
        getMemberCardNick: function() {
            return this.waitForElementVisible('@memberCardNick')
                .getText('@memberCardNick', result => {
                    this.api.globals.nickname = result.value;
                    console.log('Nickname from Page Object:', this.api.globals.nickname);
                });
        }
    }]
};
