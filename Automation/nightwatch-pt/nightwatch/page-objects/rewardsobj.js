const config = require('../../config.js');
const environment = process.env.NODE_ENV || 'qa';
const envConfig = config[environment]();
const { signPayload } = require('../../jwt');

const now = Date.now()
const JWT_SECRET = '0a7f46813bc52cc9203d901d78f03ed2ccc5c303731bc1afb17ca5a84f5f72ae'
const options = {
    expiresIn: '3000s',
    issuer:'pt-automation',
    audience:'sson'
}
const jwtToken = signPayload({ now }, JWT_SECRET,options);
module.exports= {
    url: `${envConfig.loginUrl}?now=${now}&token=${jwtToken}`,
    elements: {
        loginWithNick: {
            selector: '.icon-user'
        },
        formGroup: {
            selector: '.form-group'
        },
        nicknameInput: {
            selector: 'input[placeholder="Nickname"]'
        },
        passwordInput: {
            selector: 'input[placeholder="Password"]'
        },
        loginButton: {
            selector: '.btn.btn-xl.btn-green'
        },
        signOutButton: {
            selector: 'span.btn.btn-signin'
        },
        dashboardHeader: {
            selector: '.dashboard_header__pNYRX'
        },
        bannerRewardsBanner: {
            selector: '.banner_rewardsBanner__wySb1'
        },
        getRewardsButton: {
            selector: '.getRewards_getRewards__ZYeWo'
        },
        dailyStreaks: {
            selector: '.dailyStreaks_dailyStreaks__NsIJV'
        },
        pointsHistory: {
            selector: '.pointsHistory_pointsHistory__VoR_i'
        },
        rewardsHistory: {
            selector: '.rewardsHistory_rewardsHistory__uFLeR'
        },
        pointsHistoryFooterButton: {
            selector: '.pointsHistory_footer__UWr8N .btn.bluebtn'
        }
    },
    commands: [{
        scrollToElement: function(selector) {
            return this.execute(function(selector) {
                const element = document.querySelector(selector);
                element.scrollIntoView();
                element.style.border = '2px solid red';
            }, [selector]);
        }
    }]
};