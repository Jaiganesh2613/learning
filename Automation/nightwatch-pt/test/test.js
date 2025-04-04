const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    'Fetch Dynamic IDs and Data Test': function (browser) {
        const memberCommands = browser.page.testobj();

        memberCommands
            .navigate()
            // .execute(function() {
            //     document.querySelector('#nick_search').scrollIntoView();
            // })
            .scrollToElement('#nick_search')
            .pause(5000)
            .selectGender('Male')
            .pause(5000)
            .getValue('@genderDropdown', function (result) {
                console.log('Selected Gender:', result.value);
                this.assert.equal(result.value, 'Male', 'Selected gender should be Male');
                this.saveScreenshot(path.join(__dirname, 'screenshots', 'gender_selected.png'));
            })
            .fetchMemberData(function (result) {
                if (result.status !== 0) {
                    console.error('Error fetching dynamic IDs and data:', result);
                    return;
                }
                const memberData = result.value;
                console.log('Member Data:', memberData);

                // Selecting random 4 members
                const randomMembers = [];
                let numMembers = memberData.length;
                const numRandom = Math.min(4, numMembers);

                for (let i = 0; i < numRandom; i++) {
                    const randomIndex = Math.floor(Math.random() * numMembers);
                    randomMembers.push(memberData[randomIndex]);
                    memberData.splice(randomIndex, 1);
                    numMembers--;
                }
                console.log('Random 4 Members:', randomMembers);
                browser.globals.randomMembers = randomMembers;

                // Constructing the API URL with comma-separated IDs
                let apiUrl = 'https://stage443.paltalk.com/ws/mobile/UserWS.getMultiUserInfoByUids/';
                randomMembers.forEach((member, index) => {
                    const memberId = member.id.split('member-')[1];
                    apiUrl += memberId;

                    if (index < randomMembers.length - 1) {
                        apiUrl += ',';
                    }
                });

                console.log('API URL:', apiUrl);

                browser.globals.apiUrl = apiUrl;
            });
    },

    'Fetch and assert API data': function (browser) {
        const apiUrl = browser.globals.apiUrl;

        let userList;

        axios.get(apiUrl)
            .then(function (response) {
                console.log('API Response:', response.data);

                browser.assert.equal(response.status, 200, 'Expected status code 200');

                browser.assert.ok(response.data.result && response.data.result.list, 'Expected result list in the response');

                userList = response.data.result.list;
                browser.globals.userList = userList;
                browser.assert.ok(Array.isArray(userList) && userList.length > 0, 'Expected users array with at least one user');

                // Write userList to a JSON file
                const filePath = path.join(__dirname, 'userList.json');
                fs.writeFileSync(filePath, JSON.stringify(userList, null, 2));
                console.log(`User data written to ${filePath}`);
                browser.saveScreenshot(path.join(__dirname, 'screenshots', 'api_response.png'));
            })
            .catch(function (error) {
                console.error('Error fetching API data:', error);
                browser.assert.fail('Failed to fetch API data');
                browser.saveScreenshot(path.join(__dirname, 'screenshots', 'api_error.png'));
            });
    },

    'Click on Random Member Links': function (browser) {
        const memberPage = browser.page.testobj();
        const randomMembers = browser.globals.randomMembers;
        const tabTexts = ['Recent', 'Sender', 'Price', 'Gift Type'];
        let foundUser = null;
        let profileNickText = '';
        let profileImageSrc = '';
        let memberBadgeClass = '';
        let coverPhotoAlt = '';
        let coverPhotoSrc = '';
        let coverPhotoClass = '';
        let memberGender = '';
        let memberAge = '';
        let memberCountry = '';
        let memberLocation = '';
        let photoCount = 0;
        let giftSentValue = '';
        let giftReceivedValue = '';
        let profileViewCount = '';
        let galleryPhotoCount = 0;
        let aboutMe = '';
        let memberSince = '';
        let roomUrl = '';
        let roomName = '';
        let isShowVgifts ;
        let isSelfProfile ;
        let royalty_level = 0;
        let adultContent= '';
        // Read userList.json file synchronously with utf8 encoding
        const filePath = path.join(__dirname, 'userList.json');
        const userListRaw = fs.readFileSync(filePath, 'utf8');
        const userList = JSON.parse(userListRaw);

        if (!userList || userList.length === 0) {
            console.error('User list is empty or undefined. Aborting test.');
            browser.assert.fail('User list is empty or undefined');
            browser.end();
            return;
        }

        for (let i = 0; i < randomMembers.length; i++) {
            const memberLink = randomMembers[i].href;
            console.log(`Member Link ${i + 1}: ${memberLink}`);
            console.log('Clicking on member link:', memberLink);
            memberPage
                .navigate(memberLink)
                .waitForElementVisible('body', 10000)
                .waitForElementVisible('#layout_content__nxLbZ', 5000)
                .waitForElementVisible('@profileImage', 5000)
                .waitForElementVisible('.icon-report', 5000)
                .waitForElementVisible('.interests_card__VZS_7', 5000, false)
                .waitForElementVisible('.dailyStreaks_dailyStreaks__NsIJV', 5000)
                // .waitForElementVisible('.followedRooms_card__PeX_p', 5000, false) // Set failOnTimeout to false
                .perform(function () {
                    const elementsToCheck = ['.myRooms_card__sgdE_', '.interests_card__VZS_7', '.dailyStreaks_dailyStreaks__NsIJV', '.followedRooms_card__PeX_p'];
                    const visibleStatus = elementsToCheck.every(function (selector) {
                        return this.isVisible(selector).value;
                    }, this);

                    if (!visibleStatus) {
                        console.warn('Warning: One or more required elements are not visible.');
                        browser.saveScreenshot(path.join(__dirname, 'screenshots', 'One_or_more_required_elements_are_not_visible.png'))
                    }
                })
                .getAttribute('#__NEXT_DATA__', 'innerHTML', function(result) {
                    const data = JSON.parse(result.value);
                    isShowVgifts = data.props.pageProps.data.profileData.isShowVgifts;
                    isSelfProfile = data.props.pageProps.data.profileData.isSelfProfile;
                    royalty_level = data.props.pageProps.data.profileData.royalty_level;
                    photoCount = data.props.pageProps.data.profileData.photosCnt;
                    console.log('Show Gifts Received :', isShowVgifts, ' / ', isSelfProfile);
                    console.log('Royalty Level :', royalty_level);
                    console.log("Photos count:", photoCount);

                    if (royalty_level > 0) {
                        browser
                            .waitForElementVisible('.nickname', 10000)
                            .getText('.nickname', function (result) {
                                profileNickText = result.value;
                                browser.saveScreenshot(path.join(__dirname, 'screenshots', 'profile_nick_visible.png'));
                            })
                    } else {
                        browser
                            .waitForElementVisible('#myprofile-nickname', 10000)
                            .getText('#myprofile-nickname', function (result) {
                                profileNickText = result.value;
                                browser.saveScreenshot(path.join(__dirname, 'screenshots', 'profile_nick_visible.png'));
                            })
                    }
                })
                .getAttribute('@profileImage', 'src', function (result) {
                    profileImageSrc = result.value;
                    browser.saveScreenshot(path.join(__dirname, 'screenshots', 'profile_image_visible.png'));
                })
                .getAttribute('@memberBadge', 'class', function (result) {
                    memberBadgeClass = result.value;
                    browser.saveScreenshot(path.join(__dirname, 'screenshots', 'member_badge_visible.png'));
                })
                .getAttribute('@coverPhoto', 'alt', function (result) {
                    coverPhotoAlt = result.value;
                })
                .getAttribute('@coverPhoto', 'src', function (result) {
                    coverPhotoSrc = result.value;
                    browser.saveScreenshot(path.join(__dirname, 'screenshots', 'cover_photo_visible.png'));
                })
                .getAttribute('@coverPhoto', 'class', function (result) {
                    coverPhotoClass = result.value;
                    browser.saveScreenshot(path.join(__dirname, 'screenshots', 'member_details_visible.png'));
                })
                .getText('#member-details span:nth-child(1)', function (result) {
                    memberGender = result.value;
                })
                .getText('#member-details span:nth-child(2)', function (result) {
                    memberAge = result.value;
                })
                .getText('#member-details span:nth-child(3)', function (result) {
                    const Country = result.value.split(',');
                    memberCountry = Country[1].trim();
                    memberLocation = Country[0].trim().toLowerCase();
                })
                .getText('@giftSent', function (result) {
                    giftSentValue = result.value;
                    console.log('Gift Sent Value:', giftSentValue);
                    browser.saveScreenshot(path.join(__dirname, 'screenshots', 'gift_sent_visible.png'));
                })
                .getText('@giftReceived', function (result) {
                    giftReceivedValue = result.value;
                    console.log('Gift Received Value:', giftReceivedValue);
                    browser.saveScreenshot(path.join(__dirname, 'screenshots', 'gift_received_visible.png'));
                })
                .getText('@profileViewCount', function (result) {
                    profileViewCount = result.value;
                    console.log('Profile View Count:', profileViewCount);
                    browser.saveScreenshot(path.join(__dirname, 'screenshots', 'profile_view_count_visible.png'));
                })
                .getText('@aboutMe', function (result) {
                    aboutMe = result.value;
                    console.log('About Me:', aboutMe);
                    browser.saveScreenshot(path.join(__dirname, 'screenshots', 'about_me_visible.png'));
                })
                .getText('@memberSince', function (result) {
                    const memberSinceText = result.value;
                    console.log('Member Since:', memberSinceText);
                    const datePart = memberSinceText.split('since ')[1];
                    const memberSinceDate = new Date(datePart);
                    memberSince = `${memberSinceDate.getFullYear()}-${(memberSinceDate.getMonth() + 1).toString().padStart(2, '0')}`;
                    console.log("Member Since :", memberSince)
                    browser.saveScreenshot(path.join(__dirname, 'screenshots', 'member_since_visible.png'));
                })
                .perform(function () {
                    if (!profileNickText) {
                        console.error('Profile nickname not retrieved or empty.');
                        browser.assert.fail('Profile nickname not retrieved or empty');
                        browser.end();
                        return;
                    }

                    if (!profileImageSrc) {
                        console.error('Profile image src not retrieved or empty.');
                        browser.assert.fail('Profile image src not retrieved or empty');
                        browser.end();
                        return;
                    }

                    if (!memberBadgeClass) {
                        console.error('Member badge class not retrieved or empty.');
                        browser.assert.fail('Member badge class not retrieved or empty');
                        browser.end();
                        return;
                    }

                    if (!coverPhotoAlt) {
                        console.error('Cover photo alt not retrieved or empty.');
                        browser.assert.fail('Cover photo alt not retrieved or empty');
                        browser.end();
                        return;
                    }

                    if (!coverPhotoSrc) {
                        console.error('Cover photo src not retrieved or empty.');
                        browser.assert.fail('Cover photo src not retrieved or empty');
                        browser.end();
                        return;
                    }

                    if (!coverPhotoClass) {
                        console.error('Cover photo class not retrieved or empty.');
                        browser.assert.fail('Cover photo class not retrieved or empty');
                        browser.end();
                        return;
                    }

                    if (!memberGender) {
                        console.error('Member gender not retrieved or empty.');
                        browser.assert.fail('Member gender not retrieved or empty');
                        browser.end();
                        return;
                    }

                    if (!memberAge) {
                        console.error('Member age not retrieved or empty.');
                        browser.assert.fail('Member age not retrieved or empty');
                        browser.end();
                        return;
                    }

                    if (!memberCountry) {
                        console.error('Member Country not retrieved or empty.');
                        browser.assert.fail('Member Country not retrieved or empty');
                        browser.end();
                        return;
                    }


                    // Find the user in userList whose nickname matches profileNickText
                    for (let i = 0; i < userList.length; i++) {
                        if (userList[i].nickname === profileNickText) {
                            foundUser = userList[i];
                            break;
                        }
                    }

                    if (!foundUser) {
                        console.error(`User with nickname ${profileNickText} not found in userList.`);
                        browser.assert.fail(`User with nickname ${profileNickText} not found`);
                        browser.end();
                        return;
                    }
                    browser.perform(function() {
                        browser.waitForElementVisible('body', 5000)
                        if (foundUser.crown_level > 0) {
                            browser.getAttribute('#crown-lvl', 'alt', function(result) {
                                const altValue = result.value;
                                const expectedPrefix = 'AL';
                                const actualValue = altValue && altValue.startsWith(expectedPrefix) ? altValue.substring(expectedPrefix.length).trim() : null;
                                console.log("Crown Value:", actualValue);
                                browser.assert.equal(actualValue, foundUser.crown_level, `Expected Crown Value to be "${foundUser.crown_level}"`);
                            });
                        }
                        console.log("giftCount ",foundUser.received_gifts_count);
                        if ((isShowVgifts || isSelfProfile) && foundUser.received_gifts_count > 0) {
                            browser
                                .waitForElementVisible('#giftsReceived', 5000, false)
                                .waitForElementVisible('#topGifters', 5000, false);
                        }
                        if ((isShowVgifts || isSelfProfile) && foundUser.received_gifts_count > 6) {
                            browser
                                .waitForElementVisible('#giftsViewAll', 5000, false)
                                .click('#giftsViewAll')
                                .saveScreenshot(path.join(__dirname, 'screenshots', 'Gifts_Received.png'))
                                .pause(5000);

                            tabTexts.forEach((text) => {
                                browser
                                    .useXpath()
                                    .waitForElementVisible(`//span[text()='${text}']`, 1000)
                                    .click(`//span[text()='${text}']`)
                                    .saveScreenshot(path.join(__dirname, 'screenshots', 'Recently_Received_Gifts.png'))
                                    .pause(5000);
                            });

                            browser
                                .useCss()
                                .waitForElementVisible('.modal-close.giftsReceived_modalClose__1W76b', 5000) // Ensure modal close button is visible
                                .click('.modal-close.giftsReceived_modalClose__1W76b')
                        }
                        if (foundUser.usergroup_table_id != null) {
                            browser
                                .waitForElementVisible('.myRooms_card__sgdE_ .roomsImage_room__Re6iK', 5000, false)
                                .waitForElementVisible('#roomName')
                                .getText('#roomName', function (result) {
                                    roomName = result.value;
                                    console.log('Room Name :',roomName);
                                    // browser.saveScreenshot(path.join(__dirname, 'screenshots', 'member_details_visible.png'));
                                })
                                .getAttribute('#roomName', 'href', function (result) {
                                    roomUrl = result.value;
                                    console.log('Room Url :',roomUrl)
                                    // browser.saveScreenshot(path.join(__dirname, 'screenshots', 'member_details_visible.png'));
                                })
                                .execute(function() {
                                    // Scroll the element into view
                                    document.querySelector('.myRooms_card__sgdE_').scrollIntoView();
                                })
                                .saveScreenshot(path.join(__dirname, 'screenshots', 'my_room_section.png'))
                                .click('#roomName')
                                .waitUntil(function () {
                                    // wait until window handle for the new window is available
                                    return new Promise((resolve) => {
                                        browser.window.getAllHandles(function (result) {
                                            resolve(result.value.length === 2);
                                        });
                                    });
                                })
                                .perform(async function () {
                                    const originalWindow = await browser.window.getHandle();
                                    const allWindows = await browser.window.getAllHandles();

                                    // loop through to find the new window handle
                                    for (const windowHandle of allWindows) {
                                        if (windowHandle !== originalWindow) {
                                            await browser.window.switchTo(windowHandle);
                                            break;
                                        }
                                    }

                                    const currentWindow = await browser.window.getHandle();
                                    browser.assert.urlContains(roomUrl);
                                    browser.elements('css selector', '.adult-warning_content__J2zRY h1', function (result) {
                                        if (result.value.length > 0) {
                                            // Adult content warning is present
                                            browser.getText('.adult-warning_content__J2zRY h1', function (textResult) {
                                                const adultContent = textResult.value;
                                                console.log('Adult Content :', adultContent);

                                                if (adultContent === 'Adult Content Warning') {
                                                    browser
                                                        .waitForElementVisible('.adult-warning_buttonContainer__87d5B', 5000)
                                                        .click('.adult-warning_buttonContainer__87d5B a.btn.bluebtn:nth-of-type(2)')
                                                        .pause(2000);
                                                }
                                            });
                                        }
                                    })
                                    browser.assert.notEqual(currentWindow, originalWindow);
                                    // browser.assert.textContains('.room-name',roomName)
                                    browser.assert.textContains('.room-cover-photo_ownerNickname__HWwn6',foundUser.nickname)
                                    await browser.window.close();
                                    await browser.window.switchTo(originalWindow);
                                });
                        }
                     })
                    console.log('Expected Nickname:', foundUser.nickname);
                    console.log('Actual Nickname:', profileNickText);
                    console.log('Expected Profile Image URL to contain:', foundUser.primary_image);
                    console.log('Actual Profile Image URL:', profileImageSrc);
                    console.log('Expected Member Badge Class to contain:', foundUser.product_brand.toLowerCase());
                    console.log('Actual Member Badge Class:', memberBadgeClass);
                    console.log('Expected Cover Photo Alt:', foundUser.product_brand);
                    console.log('Actual Cover Photo Alt:', coverPhotoAlt);
                    console.log('Expected Cover Photo Src:', foundUser.background_image_name);
                    console.log('Actual Cover Photo Src:', coverPhotoSrc);
                    console.log('Expected Cover Photo Class to contain:', 'coverPhoto_coverPhoto__LgwWv');
                    console.log('Actual Cover Photo Class:', coverPhotoClass);
                    console.log('Expected Member Gender:', foundUser.gender);
                    console.log('Actual Member Gender:', memberGender);
                    console.log('Photo Count:', photoCount);

                    const timestamp = foundUser.birthdate;
                    const birthDate = new Date(timestamp);

                    const birthYear = birthDate.getFullYear();
                    const birthMonth = birthDate.getMonth();
                    const birthDay = birthDate.getDate();
                    const currentDate = new Date();
                    const currentYear = currentDate.getFullYear();
                    const currentMonth = currentDate.getMonth();
                    const currentDay = currentDate.getDate();
                    const expectedMemberSince = foundUser.registration_date.substring(0, 7);
                    // Calculate age
                    let age = currentYear - birthYear;
                    if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
                        age--;
                    }
                    console.log(`Accurate Age: ${age}`);
                    console.log('Expected Member Location:', foundUser.location.toLowerCase());
                    console.log('Actual Member Location:', memberLocation);
                    console.log('Expected Member Country:', foundUser.country);
                    console.log('Actual Member Country:', memberCountry);

                    this.assert.equal(profileNickText, foundUser.nickname, `Expected @profileNick to contain ${foundUser.nickname}`);
                    this.assert.ok(profileImageSrc.includes(foundUser.primary_image), `Expected profile image URL to contain ${foundUser.primary_image}`);
                    this.assert.ok(memberBadgeClass.includes(foundUser.product_brand.toLowerCase()), `Expected member badge class to contain ${foundUser.product_brand.toLowerCase()}`);
                    this.assert.equal(coverPhotoAlt.toLowerCase(), foundUser.product_brand.toLowerCase(), `Expected cover photo alt to be ${foundUser.product_brand}`);
                    this.assert.ok(coverPhotoClass.includes('coverPhoto_coverPhoto__LgwWv'), `Expected cover photo class to contain coverPhoto_coverPhoto__LgwWv`);
                    // this.assert.ok(coverPhotoSrc.includes(foundUser.background_image_name), `Expected cover photo src to contain ${foundUser.background_image_name}`);
                    this.assert.equal(memberGender, foundUser.gender, `Expected member gender to be ${foundUser.gender}`);
                    this.assert.equal(memberAge, age, `Expected member age to be ${age}`);
                    this.assert.equal(memberCountry, foundUser.country, `Expected member Country to be ${foundUser.country}`);
                    this.assert.equal(memberLocation, foundUser.location.toLowerCase(), `Expected member Location to be ${foundUser.location.toLowerCase()}`);
                    this.assert.equal(giftSentValue, foundUser.sent_gifts_count, `Expected gift sent value to be ${foundUser.sent_gifts_count}`);
                    this.assert.equal(giftReceivedValue, foundUser.received_gifts_count, `Expected gift received value to be ${foundUser.received_gifts_count}`);
                    this.assert.equal(profileViewCount, foundUser.profile_views_count, `Expected profile view count to be ${foundUser.profile_views_count}`);
                    this.assert.equal(aboutMe, foundUser.about_me, `Expected About Me to be ${foundUser.about_me}`);
                    this.assert.ok(memberSince.includes(expectedMemberSince), `Expected Member Since to include ${expectedMemberSince}`);
                })
                .pause(1000)
                // Perform action based on photoCount
                .perform(function () {
                    if (parseInt(photoCount) > 3) {
                        console.log('Clicking on "View All" for photos.');
                        this.execute(function() {
                            // Scroll the element into view
                            document.querySelector('.userProfile_profileContainer__8k2DK').scrollIntoView();
                        })
                            .pause(5000)
                            .click('#photosViewAll')
                            .waitForElementVisible('#profile-pic-icon img', 5000)
                            .getAttribute('#profile-pic-icon img', 'src', function(result) {
                                if (result && result.value) {
                                    let imageUrl = result.value;
                                    console.log('Image URL:', imageUrl);
                                    browser.assert.ok(imageUrl.includes(foundUser.primary_image), `Profile Image should match ${foundUser.primary_image}`);
                                    browser.saveScreenshot(path.join(__dirname, 'screenshots', 'image_src.png'));
                                }
                            })
                            .pause(5000)
                            .waitForElementVisible('body', 10000)
                            .elements('css selector', '.gallery_myPhoto__Uesto', (result) => {
                                galleryPhotoCount = result.value.length;
                                this
                                    .waitForElementVisible('#back-to-profile',5000)
                                    .click('#back-to-profile');
                                console.log('Number of photos in gallery:', galleryPhotoCount);
                                console.log('Photo count from profile:', photoCount);
                                this.assert.equal(galleryPhotoCount, parseInt(photoCount), `Expected ${photoCount} photos in gallery, but found ${galleryPhotoCount}`);
                                browser.saveScreenshot(path.join(__dirname, 'screenshots', 'photo_count.png'))
                            });
                    }
                })
                .perform(function () {
                    if (foundUser.profile_banned === 0) {
                        this.expect.element('#profileBanned').to.not.be.present;
                    } else {
                        this.expect.element('#profileBanned').to.be.present;
                    }
                    browser.saveScreenshot(path.join(__dirname, 'screenshots', 'profile_banned_check.png'));
                })
        }
        browser.end();
    },
};