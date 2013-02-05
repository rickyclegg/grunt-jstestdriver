/**
 * grunt-jstestdriver
 * https://github.com/rickyclegg/grunt-jstestdriver
 *
 * Copyright (c) 2013 Ricky Clegg
 * Licensed under the MIT license.
 */
module.exports = function (grunt) {
    "use strict";

    var SUB_TASKS = ['start_and_run', 'run_tests'];

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

    function isValidOptionsProperty(options, propertyName) {
        return propertyName !== "length" && options[propertyName] !== undefined && options[propertyName] !== null;
    }

    function getOptionsArray(options) {
        var names, name, i, l, arr = [];

        names = Object.getOwnPropertyNames(options);
        l = names.length;
        for (i = 0; i < l; i += 1) {
            name = names[i];

            if (isValidOptionsProperty(options, name)) {
                arr.push("--" + name);
                arr.push(options[name]);
            }
        }

        arr.push('&');

        return arr;
    }

    grunt.registerMultiTask("jstestdriver", "Grunt task for uniting testing using JS Test Driver.", function () {
        var done = this.async(),
            options = grunt.utils._.extend({},
                grunt.config.get('jstestdriver').options,
                this.data);

        if (SUB_TASKS.indexOf(this.target) > -1) {
            grunt.helper(this.target, options, done);
        } else {
            grunt.log.writeln('jstestdriver will not run as "' + this.target + '" is not a subtask of jstestdriver.');
        }
    });

    grunt.registerHelper('start_and_run', function (options, done) {
        grunt.helper('exec', getOptionsArray(options), done);
    });

    grunt.registerHelper('run_tests', function (options, done) {
        grunt.helper('exec', ["--config", options.config, "--tests", options.tests], done);
    });

    grunt.registerHelper('exec', function (options, done) {
        var jsTestDriver = grunt.utils.spawn({
            cmd: 'java',
            args: ["-jar", getPathToJar()].concat(options)
        }, function (error, result) {
            if (error || hasFailedTests(result)) {
                done(false);
            } else {
                done();
            }
        });

        jsTestDriver.stdout.pipe(process.stdout);
        jsTestDriver.stderr.pipe(process.stderr);
    });
};
