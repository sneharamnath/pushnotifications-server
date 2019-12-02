const { Expo } = require('expo-server-sdk');
const tokens = require('../routes/tokens');
let pool = require('../../database');

const expo = new Expo();

// let savedPushTokens = ['ExponentPushToken[P6Hm9oEChVDz7OPwO-_Qsj]'];

let savedPushTokens = [];
const formatDate = function(date) {

    let day = `${date.getDate()}`.padStart(2,0);
    let month = `${date.getMonth() + 1}`.padStart(2,0);
    let year = date.getFullYear();
  
    return year + '-' + month + '-' + day;
}
  
const getMessage = function(message){
    let response = {};
    let today = new Date();
    let tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1)
    today = formatDate(today);
    tomorrow = formatDate(tomorrow);
    if(message.requests && message.requests.length === 1){
        message.requests.forEach((item) => {
            let dayText = (item.date === today) ? ' today' :  (item.date === tomorrow) ? ' tomorrow' : '';
            response.title = getMessageHeading(message, item, dayText, false);
            response.content = message.reason;
        });
        return response;
    }
    if(message.requests && message.requests.length > 1){
        let item = message.requests[0];
        let dayText = (item.date === today) ? ' today' :  (item.date === tomorrow) ? ' tomorrow' : '';
        response.title = getMessageHeading(message, item, dayText, true);
        response.content = message.reason;
        return response;
    }
}

const getMessageHeading = function(message, item, day, hasMoreThanOneRequest){
    let appendFirstValText = (item.firstHalf === 'Leave') ? 'on' : '';
    let appendSecondValText = (item.secondHalf === 'Leave') ? 'on' : '';
    let appendText = hasMoreThanOneRequest ? ' and has planned leaves/WFH for subsequent days' : '';
    let messageText = '';
    if(day){
        (item.firstHalf === item.secondHalf) ?  messageText = message.id + ' is ' + appendFirstValText + item.firstHalf  + day + appendText :
        (item.firstHalf === 'WFO') ? messageText = message.id + ' is ' + appendSecondValText + item.secondHalf + 'in second half ' + day + appendText :
        (item.secondHalf === 'WFO') ? messageText = message.id + ' is ' + appendFirstValText + item.firstHalf + 'in first half' + day + appendText :
        messageText = message.id + ' is ' + appendFirstValText + item.firstHalf + 'in first half and' + appendSecondValText + item.secondHalf + 'in second half' + day + appendText;
        return messageText;
    }else{
        return message.id + ' has planned WFH/Leaves for subsequent days';
    }
}

const handlePushTokens = (message) => {
    pool.query('SELECT * FROM appTokens', function(err, response){
        savedPushTokens = JSON.parse(JSON.stringify(response));
        savedPushTokens = savedPushTokens.map(element => {
            return element.token;
        });
        let notifications = [];
        var response =  {};
        let messageResponse = getMessage(message);
        switch(message.type){
            case 'IntimationCreatedKafkaEvent':
                response.title = messageResponse.title,
                response.content = messageResponse.content
                break;
            case 'IntimationCancelledKafkaEvent':
                response.title = 'Cancelled',
                response.content = message.id + ' has cancelled the intimation'
                break;
            default:
                response.title = '',
                response.content = ''
                break;
        }
        if(response.title){
            for (let pushToken of savedPushTokens) {
              if (!Expo.isExpoPushToken(pushToken)) {
                console.error(`Push token ${pushToken} is not a valid Expo push token`);
                continue;
              }
              notifications.push({
                to: pushToken,
                sound: 'default',
                title: response.title,
                body: response.content,
                data: message
              })
            }
            let chunks = expo.chunkPushNotifications(notifications);
            (async () => {
                for (let chunk of chunks) {
                    try {
                        let receipts = await expo.sendPushNotificationsAsync(chunk);
                        console.log(receipts);
                    } catch (error) {
                        console.error(error);
                    }
                }
            })();
        }  
    });
}

module.exports.handlePushTokens = handlePushTokens;