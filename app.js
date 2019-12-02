var express = require('express');
var app = express();

var kafka = require('kafka-node');
let pushNotifications = require('./src/handlers/pushnotifications');
const Consumer = kafka.Consumer;
const client = new kafka.KafkaClient("localhost:2181");

//Handle push notifications

const consumer = new Consumer(client, [ { topic: 'employee', partition: 0 } ], { autoCommit: true });
consumer.on('message', function (message) {
    var data = JSON.parse(message.value);
    pushNotifications.handlePushTokens(data);
});

const indexRouter = require('./src/routes/index');
const tokenRouter = require('./src/routes/tokens');

const PORT_NUMBER = 3000; // port on which you want to run your server on

app.use(express.json());

// Routes
app.use('/', indexRouter);
app.use('/token', tokenRouter);

app.listen(PORT_NUMBER, () => {
    console.log('Server Online on Port' + PORT_NUMBER);
});

module.exports = app;