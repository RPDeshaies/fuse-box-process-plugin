"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var spawn = require('child_process').spawn;
var ProcessPluginClass = (function () {
    function ProcessPluginClass(opts) {
        this.processList = {};
        this.opts = opts;
    }
    ;
    ProcessPluginClass.prototype.start = function () {
        var _this = this;
        this.opts.process.forEach(function (detail) {
            console.log("Starting " + detail.processName + " [" + detail.processArgs + "]...");
            var process = _this.createProcess(detail);
            _this.processList[detail.processName] = process;
        });
    };
    ProcessPluginClass.prototype.stop = function () {
        for (var key in this.processList) {
            var detail = this.processList[key].detail;
            console.log("Killing " + detail.processName + " [" + detail.processArgs + "]...");
            this.processList[key].process.kill();
            delete this.processList[key];
        }
    };
    ProcessPluginClass.prototype.postBundle = function (context) {
        this.stop();
        this.start();
    };
    ProcessPluginClass.prototype.createProcess = function (detail) {
        var _this = this;
        var process = {
            process: spawn(detail.processName, detail.processArgs),
            detail: detail
        };
        if (detail.verbose) {
            process.process.stdout.on('data', function (data) {
                console.log(data.toString());
            });
            process.process.stderr.on('data', function (data) {
                console.log(data.toString());
            });
        }
        process.process.on('close', function (code, signal) {
            console.log("Finished " + detail.processName + " [" + detail.processArgs + "]...");
            delete _this.processList[detail.processName];
        });
        return process;
    };
    return ProcessPluginClass;
}());
exports.ProcessPluginClass = ProcessPluginClass;
function ProcessPlugin(options) {
    return new ProcessPluginClass(options);
}
exports.ProcessPlugin = ProcessPlugin;
;
//# sourceMappingURL=plugin.js.map