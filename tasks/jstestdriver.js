/*
 * grunt-jstestdriver
 * https://github.com/rickyclegg/grunt-jstestdriver
 *
 * Copyright (c) 2013 Ricky Clegg
 * Licensed under the MIT license.
 */
'use strict';
module.exports = function (grunt) {

    var INVALID_FLAGS = ['browser', 'config', 'dryRunFor', 'port', 'server', 'serverHandlerPrefix', 'canFail'];

    grunt.registerTask('jstestdriver', 'Grunt task for uniting testing using JS Test Driver.', function () {

        var options = this.options({
                tests: 'all',
                canFail: false
            }),
            config = grunt.config.get('jstestdriver'),
            done = this.async(),
            numberOfPassedTests = 0,
            numberOfFailedTests = 0,
            numberOfErrorTests = 0,
            failedTests = [];

        grunt.verbose.writeflags(options, 'Options');

        function taskComplete() {
            if (!options.canFail && failedTests.length > 0) {
                grunt.fail.fatal(failedTests.join('\n\n'));
                done(false);
            } else {
                grunt.log.ok('Total Passed: ' +
                    numberOfPassedTests + ', Fails: ' + numberOfFailedTests +
                    ', Errors: ' + numberOfErrorTests);
                done();
            }
        }

        function runJSTestDriver(configFileLocation, options, processNext) {
            var cp;

            function setNumberOfPassesAndFails(result) {
                // The result string looks like this:
                // Passed: 114; Fails: 0; Errors: 0
                var resultAsStr = result.toString(),
                    resultReg = /Passed: (\d+); Fails: (\d+); Errors: (\d+)/,
                    parsedResult = resultReg.exec(resultAsStr);

                if (resultAsStr && resultAsStr.indexOf('RuntimeException') === -1) {
                    numberOfPassedTests += parseInt(parsedResult[1], 10);
                    numberOfFailedTests += parseInt(parsedResult[2], 10);
                    numberOfErrorTests  += parseInt(parsedResult[3], 10);
                } else {
                    grunt.fail.fatal('Did you start your server?\n' + resultAsStr);
                }
            }

            function hasFailedTests(result) {
                var prop, resultStr = "";

                for (prop in result) {
                    if (result.hasOwnProperty(prop)) {
                        resultStr += result[prop];
                    }
                }

                return resultStr.indexOf("Error:") > -1;
            }

            function processCompleteTests() {
                grunt.log.verbose.writeln('>> Finished running file: ' + configFileLocation);
                grunt.log.verbose.writeln('');

                processNext();
            }

            function processed(error, result) {
                setNumberOfPassesAndFails(result);

                if (error || hasFailedTests(result)) {
                    failedTests.push(result);
                    grunt.verbose.writeln('   ONE or MORE tests have failed in:');
                } else {
                    grunt.verbose.writeln(result);
                }

                processCompleteTests();
            }

            function getOptionsArray(options) {
                var names, name, i, l, arr = [];

                names = Object.getOwnPropertyNames(options);
                l = names.length;
                for (i = 0; i < l; i += 1) {
                    name = names[i];

                    if (INVALID_FLAGS.indexOf(name) === -1) {
                        arr.push("--" + name);
                        arr.push(options[name]);
                    } else {
                        if (name !== 'canFail') {
                            grunt.verbose.writeln('WARNING - ' +
                                name + ' is not a valid config for use with the grunt-jstestdriver!');
                        }
                    }
                }

                return arr;
            }

            cp = grunt.util.spawn({
                cmd: 'java',
                args: ["-jar",
                       __dirname + '/../lib/jstestdriver.jar',
                       "--config",
                       configFileLocation].concat(getOptionsArray(options))
            }, processed);

            if (grunt.option('verbose')) {
                cp.stdout.pipe(process.stdout);
                cp.stderr.pipe(process.stderr);
            }
        }

        if (typeof config.files === 'string') {
            config.files = [config.files];
        }

        if (options.testOutput) {
            grunt.file.mkdir(options.testOutput);
        }

        grunt.util.async.forEachSeries(config.files, function (filename, processNext) {
            runJSTestDriver(filename, options, processNext);
        }.bind(this), taskComplete);
    });

};
