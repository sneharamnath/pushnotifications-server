var express = require('express');
var router = express.Router();
var pool = require('../../database');

var savedPushTokens = [];
let arr = [];

const saveToken = (token) => {
  pool.query('SELECT * FROM appTokens', function(err, response){
    savedPushTokens = JSON.parse(JSON.stringify(response));
    savedPushTokens.forEach(element => {
      arr.push(element.token);
    });
    if(arr.indexOf(token) < 0){
      let sql = `INSERT INTO appTokens (token) VALUES ('${token}')`;  
      pool.query(sql, function (err, result) {  
        if (err) throw err;  
        console.log("1 record inserted");  
      });  
    }
  });
}

router.post('/', (req, res) => {
    saveToken(req.body.token.value);
    console.log(`Received push token, ${req.body.token.value}`);
    res.send(`Received push token, ${req.body.token.value}`);
});

module.exports = router;
// module.exports.savedPushTokens = savedPushTokens;