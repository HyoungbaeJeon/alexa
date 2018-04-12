let Alexa = require('alexa-sdk');
let http = require('http');

const BUILD_JOB_URL = "http://XXX.XXX.XXX.XXX:8080/job/build-monitor-front/build?token=token";

exports.handler = function (event, context, callback) {
    let alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('Build');
    },
    'BuildIntent': function () {
        this.emit('Build')
    },
    'Build': function () {
        let contextFunc = this.context;
        let emitFunc = this.emit;

        new Promise((resolve) => {
            http.get(BUILD_JOB_URL, (res) => {
                console.log(`Got response: ${res.statusCode}`);
                if (res.statusCode == 201 || res.statusCode == 200) {
                    emitFunc(':tell', 'Start Jenkins Build');
                }
                contextFunc.succeed();
                resolve();
            }).on('error', function (e) {
                console.log(`Got error: ${e.message}`);
                emitFunc(':tell', 'Jenkins Build Fail');
                contextFunc.done(null, 'FAILURE');
                resolve();
            });
        });
    }
};
