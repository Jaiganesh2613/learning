
module.exports = {
    url: 'https://stage443.paltalk.com/people/webapp/index.wmt',

    elements: {
        genderDropdown: '#dd_gender',
        genderOptions: 'div[role="listbox"]',
        memberElements: '[id^="member-"]',
        memberLink: 'a[id="member-card-nick"]',
        profileNick: {
            selector: '#myprofile-nickname'
        },
        profileImage: {
            selector: '#profileImage'
        },
        memberBadge: {
            selector: '.member-badge'
        },
        coverPhoto: {
            selector: 'img.coverPhoto_coverPhoto__LgwWv'
        },
        memberDetails: {
            selector: '#member-details'
        },
        photoCount: {
            selector: '#myPhotos #photos-cnt'
        },
        giftSent: {
            selector: '#profile-gift-sent'
        },
        giftReceived: {
            selector: '#profile-gift-rcv'
        },
        profileViewCount: {
            selector: '#profile-vc'
        },
        aboutMe: {
            selector: '#aboutMe'
        },
        memberSince: {
            selector: '#member-since'
        },
        photosViewAll: {
            selector: '#photosViewAll'
        },
        profileBanned: {
            selector: '#profileBanned'
        }
    },

    commands: [{
        selectGender(option) {
            console.log(`Selecting gender option: ${option}`);
            const self = this;
            return self
                .click('@genderDropdown')
                .waitForElementVisible('@genderOptions', 5000)
                .useXpath()
                .click(`//div[@role="option" and text()="${option}"]`)
                .useCss();
        },
        scrollToElement: function(selector) {
            return this.execute(function(selector) {
                const element = document.querySelector(selector);
                element.scrollIntoView();
                element.style.border = '2px solid red';
            }, [selector]);
        },
        fetchMemberData(callback) {
            const self = this;
            self.api.waitForElementVisible('body', 5000, function() {
                self.api.execute(function() {
                    const elements = document.querySelectorAll('[id^="member-"]');
                    const memberData = [];
                    elements.forEach(function(element) {
                        const id = element.id;
                        const linkElement = element.querySelector('a[id="member-card-nick"]');
                        if (linkElement) {
                            const name = linkElement.getAttribute('title');
                            const href = linkElement.getAttribute('href');
                            memberData.push({
                                id: id,
                                name: name,
                                href: href
                            });
                        }
                    });
                    return memberData;
                }, [], function(result) {
                    callback(result);
                });
            });
            return self;
        },
    }]
};
