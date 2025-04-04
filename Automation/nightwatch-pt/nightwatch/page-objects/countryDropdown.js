module.exports = {
    elements: {
        countryDropdown: 'div[role="combobox"]',
        countryInput: 'input#dd_country',
        dropdownIcon: 'div.mantine-Input-rightSection i.icon-dropdownarrow',
    },
    commands: [{
        selectCountry(country) {
            return this
                .click('@countryDropdown')
                .setValue('@countryInput', country)
                .api.pause(500)
                .useXpath()
                .click(`//div[@role='option' and text()='${country}']`)
                .useCss();
        }
    }]
};
