var _      = require('lodash');
var moment = require('moment');

module.exports = {
    assertEvent: function assertEvent(theContract, theFilter) {
        return new Promise(function (resolve, reject) {
            var theEvent = theContract[theFilter.event]();
            theEvent.watch();
            theEvent.get(function (error, logs) {
                var _logs = JSON.parse(JSON.stringify(logs));
                var log   = _.filter(_logs, theFilter);

                // console.log('FILTER', theFilter);
                // console.log('LOG', log);

                if (log.length > 0) {
                    // console.log(moment().format('LTS') + " // Event logged: " + theFilter.event);
                    resolve(log);
                } else {
                    throw Error("[utils.js] Failed to find filtered event for: " + theFilter.event);
                }

            });
            theEvent.stopWatching();
        });
    }
};
