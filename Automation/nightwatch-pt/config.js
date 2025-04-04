// config.js
exports.qa = () => ({
    topMemberNick: '',
    username: 'test_user_2000',
    password: '9080230816',
    subscribtionLevel: '',
    url: 'https://stage443.paltalk.com/people/webapp/index.wmt',
    loginUrl: 'https://stage443.paltalk.com/mpt/MyPalTalkHome.jsp',
    getRewardPageUrl: function() {
        return `https://stage443.paltalk.com/people/users/${this.username}/MyRewards.wmt`;
    },
    recaptchaTestKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
});

exports.prod = () => ({
    topMemberNick: '',
    username: 'test_user_2000',
    password: '9080230816',
    subscribtionLevel: '',
    url: 'https://www.paltalk.com/people/webapp/index.wmt',
    loginUrl: 'https://commerce.paltalk.com/mpt/MyPalTalkHome.jsp',
    getRewardPageUrl: function() {
        return `https://www.paltalk.com/people/users/${this.username}/MyRewards.wmt`;
    },
    recaptchaTestKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
    sub:'https://commerce.paltalk.com/mpt/ControllerServlet?RequestId=MyPalTalk.PalPlusSubscription&from=header&ref=mptupgrade'
});
