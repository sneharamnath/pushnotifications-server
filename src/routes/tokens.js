var express = require('express');
var router = express.Router();

var savedPushTokens = [];
const saveToken = (token) => {
    if (savedPushTokens.indexOf(token) === -1) {
      savedPushTokens.push(token);
    }
}

router.post('/', (req, res) => {
    saveToken(req.body.token.value);
    console.log(`Received push token, ${req.body.token.value}`);
    res.send(`Received push token, ${req.body.token.value}`);
});

module.exports = router;
module.exports.savedPushTokens = savedPushTokens;