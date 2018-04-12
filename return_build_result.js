let Alexa = require('alexa-sdk');
let http = require('http');

const BUILD_JOB_URL = "http://XXX.XXX.XXX.XXX:8080/job/build-monitor-front/lastBuild/api/json";

exports.handler = function (event, context, callback) {
    let alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('Build');
    },
    'BuildResultIntent': function () {
        this.emit('Build')
    },
    'Build': function () {
        let contextFunc = this.context;
        let emitFunc = this.emit;

        new Promise((resolve) => {
            http.get(BUILD_JOB_URL, (res) => {

                res.on('data', function(chunk) {
                    console.log('BODY: ' + chunk);
                    var jsonData = JSON.parse(chunk);
                    console.log('last build result: ' + jsonData.result);

                    if (jsonData.result == "SUCCESS") {
                        emitFunc(':tell', 'build succeed!');
                    } else {
                        emitFunc(':tell', 'nuclear launch detected.');
                    }
                    contextFunc.succeed();
                  });
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
