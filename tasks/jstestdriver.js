/*
 * grunt-jstestdriver
 * https://github.com/rickyclegg/grunt-jstestdriver
 *
 * Copyright (c) 2013 Ricky Clegg
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    var path = require('path'),
        fs = require('fs'),
        childProcess = require('child_process');

    grunt.registerTask('jstestdriver', 'Grunt task for uniting testing using JS Test Driver.', function () {

        var options = this.options({
                port: '9876',
                tests: 'all'
            }),
            done = this.async(),
            config = grunt.config.get('jstestdriver');

        grunt.verbose.writeflags(options, 'Options');

        grunt.util.async.forEach(config.files, function (filename) {
            grunt.log.writeln('Running file: ' + filename);

            runJSTestDriver(filename, options);

        }.bind(this), this.async());

        function runJSTestDriver(configFileLocation, options) {

            var cp;

            function next() {
                grunt.log.writeln('Tried to call next');
            }

            function getPathToJar() {
                var path = require("path");

                return path.join(__dirname, "../lib", "jstestdriver.jar");
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

            function stopAsTestsHaveFailed(error) {
                grunt.log.writeln(error);
                done(false);
            }

            function processed(error, result, code) {
                if (error || hasFailedTests(result)) {
                    stopAsTestsHaveFailed(result);
                } else {
                    grunt.log.writeln('Finished running file: ' + configFileLocation);
                }

                next();
            }

            function getOptionsArray(options) {
                var names, name, i, l, arr = [];

                names = Object.getOwnPropertyNames(options);
                l = names.length;
                for (i = 0; i < l; i += 1) {
                    name = names[i];

                    arr.push("--" + name);
                    arr.push(options[name]);
                }

                arr.push('&');

                return arr;
            }

            grunt.log.writeln('Run: ' + ["-jar", getPathToJar(), "--config", configFileLocation].concat(getOptionsArray(options)).join(''));

            /*cp = grunt.util.spawn({
                cmd: 'java',
                args: ["-jar", getPathToJar(), "--config", configFileLocation].concat(getOptionsArray(options))
            }, processed);*/

            if (grunt.option('verbose')) {
                cp.stdout.pipe(process.stdout);
                cp.stderr.pipe(process.stderr);
            }
        }
    });

};
