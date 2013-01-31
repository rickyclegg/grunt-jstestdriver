/**
 * grunt-jstestdriver
 * https://github.com/rickyclegg/grunt-jstestdriver
 *
 * Copyright (c) 2013 Ricky Clegg
 * Licensed under the MIT license.
 */
module.exports = function (grunt) {
    "use strict";

    grunt.registerTask("jstestdriver", "Grunt task for uniting testing using JS Test Driver.", function () {
        var OPTION_PROP_PREFIX = "--",
            options,
            path = require("path"),
            done = this.async(),
            errorCount = 0;

        function log(msg) {
            grunt.log.writeln(msg);
        }

        function throwError(msg) {
            errorCount += 1;
            grunt.log.error(msg);
        }

        function getPathToJar() {
            return path.join(__dirname, "../lib", "jstestdriver.jar");
        }

        function doesValueExistInArray(arr, value) {
            return arr.indexOf(value) !== -1;
        }

        function evalOptionsExistance(arr, value, errMsg) {
            var valid = doesValueExistInArray(arr, OPTION_PROP_PREFIX + value);
            if (!valid) {
                log(errMsg);
            }

            return valid;
        }

        function evalOptionsExistanceAndThrowError(arr, value, errMsg) {
            var valid = doesValueExistInArray(arr, OPTION_PROP_PREFIX + value);

            if (!valid) {
                grunt.fail.errorCount += 1;
                throwError(errMsg);
            }

            return valid;
        }

        function evalOptionsData(optionsArray) {
            var portValid,
                browserValid,
                configValid,
                testsValid;

            if (optionsArray.length === 0) {
                log("You have not specified any options. Add JsTestDriver to your grunt file.");
            }

            configValid = evalOptionsExistance(optionsArray,
                "config",
                "You have not specified your own config file. JsTestDriver will use the default location.");

            if (configValid) {
                log("Specifying a config option means you can add server information in the file.");
            } else {
                evalOptionsExistanceAndThrowError(optionsArray,
                    "tests",
                    "No tests specified in JsTestDriver config in grunt.js");
            }

            portValid = evalOptionsExistanceAndThrowError(optionsArray,
                "port",
                "No port specified in JsTestDriver config in grunt.js");

            testsValid = evalOptionsExistanceAndThrowError(optionsArray,
                "tests",
                "No tests specified in JsTestDriver config in grunt.js");

            browserValid = evalOptionsExistanceAndThrowError(optionsArray,
                "browser",
                "No browser specified in JsTestDriver config in grunt.js");

            return configValid || (portValid && browserValid && testsValid);
        }

        function getOptionsArray(options) {
            var names, name, i, l, arr = [];

            names = Object.getOwnPropertyNames(options);
            l = names.length;
            for (i = 0; i < l; i += 1) {
                name = names[i];
                if (options[name] !== undefined && options[name] !== null) {
                    arr.push(OPTION_PROP_PREFIX + name);
                    arr.push(options[name]);
                }
            }

            return evalOptionsData(arr) ? arr : null;
        }

        function hasFailedTests(result) {
            var prop, resultStr = "";

            for (prop in result) {
                if (result.hasOwnProperty(prop)) {
                    resultStr += result[prop];
                }
            }

            console.log(resultStr, resultStr.indexOf("Error") > -1);

            return resultStr.indexOf("Error") > -1;
        }

        function run(options, onComplete) {
            var jarFile = ["-jar", getPathToJar()],
                jarOptions = getOptionsArray(options),
                jsTestDriver;

            if (jarOptions) {
                jsTestDriver = grunt.utils.spawn({
                    cmd: 'java',
                    args: jarFile.concat(jarOptions)
                }, function (error, result) {
                    if (error || !hasFailedTests(result)) {
                        throwError(error.stderr);
                        onComplete(false);
                    } else {
                        onComplete();
                    }
                });

                jsTestDriver.stdout.pipe(process.stdout);
                jsTestDriver.stderr.pipe(process.stderr);
            } else {
                onComplete(false);
            }
        }

        options = grunt.config.get("jstestdriver");

        run(options, done);
    });
};
