module.exports = {
    elements: {
        clearFiltersButton: '.peoplesearch_btn__Fh9Vw',
    },
    commands: [{
        clickClearFiltersButton() {
             this
                .waitForElementVisible('@clearFiltersButton', 5000)
                .click('@clearFiltersButton');
            console.log("clicked");
            return this;
        },
    }]
};
