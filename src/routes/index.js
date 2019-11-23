var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.send('Push Notification Server Running'); 
});

module.exports = router;