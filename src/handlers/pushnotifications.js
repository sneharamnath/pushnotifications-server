const { Expo } = require('expo-server-sdk');
const tokens = require('../routes/tokens');

const expo = new Expo();

let savedPushTokens = tokens.savedPushTokens;

const handlePushTokens = (message) => {
    let notifications = [];
    let response = {};  
    response.title = "Woo hoo!";
    response.content = message;
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
        data: {message}
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

module.exports.handlePushTokens = handlePushTokens;