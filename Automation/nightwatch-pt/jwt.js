var jwt = require('jsonwebtoken');
require('dotenv').config()

const tokenToVerify = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub3ciOjE2NjcxOTE0OTgxNDgsImlhdCI6MTY2NzE5MTQ5OCwiZXhwIjoxNjY3MTk0NDk4fQ.nHDjnsadLjkq8r5CjwT8RrpxFRoNqM8_Op2eSJZcFEY'
const JWT_SECRET = '0a7f46813bc52cc9203d901d78f03ed2ccc5c303731bc1afb17ca5a84f5f72ae'


const signPayload = (payload, secret, options) => {
    const jwtToken = jwt.sign(payload, secret, options);
    return jwtToken;
};

const verify = (token, secret) => {
    return jwt.verify(token, secret)
};
// const now = Date.now()

// 1) Create token
// const jwtToken = signPayload({ now }, JWT_SECRET)

// jwtToken.then((response) => {
//     console.log("🚀 ~ file: jwt.js ~ line 29 ~ jwtToken.then ~ response", now, response);
// })

// 2) Verify Token.

// verify(tokenToVerify, JWT_SECRET).then((response) => {
//     console.log('isValid ===> ', response);
// })
module.exports = {
    signPayload,
    verify
};
