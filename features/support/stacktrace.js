var path = require('path');
var filteredPathPrefix = path.resolve(__dirname, '..');
var originalPrepareStackTrace;
var stackTraceDepth = 1;
if (originalPrepareStackTrace = Error.prepareStackTrace) {
    Error.prepareStackTrace = function (error, stack) {
        var message = [error.name + ': ' + error.message];
        for (var i = 0; i < stack.length; i++ ) {
            if (stack[i].getFileName().indexOf(filteredPathPrefix) == 0) message.push('  at ' + stack[i]);
        }
        return message.slice(0, stackTraceDepth + 1).join('\n');
    };
}

