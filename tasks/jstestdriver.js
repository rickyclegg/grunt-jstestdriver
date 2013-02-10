/**
 * grunt-jstestdriver
 * https://github.com/rickyclegg/grunt-jstestdriver
 *
 * Copyright (c) 2013 Ricky Clegg
 * Licensed under the MIT license.
 */
module.exports = function (grunt) {
    "use strict";

    var SUB_TASKS = ['start_and_run', 'run_tests'],
        COMMAND_LINE_FLAGS = [
            'browser',
            'browserTimeout',
            'captureConsole',
            'config',
            'dryRunFor',
            'help',
            'port',
            'preloadFiles',
            'requiredBrowsers',
            'reset',
            'server',
            'serverHandlerPrefix',
            'testOutput',
            'tests',
            'plugins',
            'basePath',
            'runnerMode'
        ];

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
        return COMMAND_LINE_FLAGS.indexOf(propertyName) > -1 &&
            options[propertyName] !== undefined &&
            options[propertyName] !== null;
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

        return arr;
    }

    function convertConfigToArray(options) {
        if (options.config && !grunt.utils._.isArray(options.config)) {
            options.config = [options.config];
        }
    }

    function isAllowToRunTest(task) {
        return (task.numberOfConfigs === 0 && task.numberOfConfigsRun === 0) ||
            (task.configurations && task.configurations.length > 0);
    }

    function hasAConfigurationToRun(task) {
        return task.configurations && task.configurations.length > 0;
    }

    function getSubTaskName(task) {
        return task.numberOfConfigsRun > 0 ? SUB_TASKS[0] : SUB_TASKS[1];
    }

    function runConfiguration(task, done) {
        var options = grunt.utils._.clone(task.options);

        if (isAllowToRunTest(task)) {
            task.numberOfConfigsRun += 1;
            options.config = task.configurations.shift();
            grunt.log.writeln();
            grunt.log.writeln('Running config file: ' + (options.config || "Default"));
            convertConfigToArray(options);

            grunt.helper(task.target, task, options, done);
        }
    }

    function runNextConfigOrFinish(task, done, error, result) {
        if (error || hasFailedTests(result)) {
            done(false);
        } else {
            if (hasAConfigurationToRun(task)) {
                grunt.log.writeln();
                grunt.log.writeln('Run next test configuration...');
                runConfiguration(task, done);
            } else {
                done();
            }
        }
    }

    function getConfigurationArray(task) {
        return (task.options.config && task.options.config.shift && task.options.config.slice()) || [];
    }

    function setupTaskVariables(task, options) {
        task.options = options;
        task.configurations = getConfigurationArray(task);
        options.config = null;
        task.numberOfConfigs = task.options.config ? task.options.config.length : 0;
        task.numberOfConfigsRun = 0;
    }

    grunt.registerMultiTask("jstestdriver", "Grunt task for uniting testing using JS Test Driver.", function () {
        var done = this.async(),
            options = grunt.utils._.extend({},
                grunt.config.get('jstestdriver').options,
                this.data);

        setupTaskVariables(this, options);

        if (SUB_TASKS.indexOf(this.target) > -1) {
            runConfiguration(this, done);
        } else {
            grunt.log.writeln('jstestdriver will not run as "' + this.target + '" is not a subtask of jstestdriver.');
        }
    });

    grunt.registerHelper('start_and_run', function (task, options, done) {
        grunt.helper('exec', task, getOptionsArray(options), done);
    });

    grunt.registerHelper('run_tests', function (task, options, done) {
        var customOptions = ["--tests", options.tests];

        if (options.config) {
            customOptions.push("--config", options.config);
        }

        grunt.helper('exec', task, customOptions, done);
    });

    grunt.registerHelper('exec', function (task, options, done) {
        var jsTestDriver = grunt.utils.spawn({
            cmd: 'java',
            args: ["-jar", getPathToJar()].concat(options)
        }, function (error, result) {
            runNextConfigOrFinish(task, done, error, result);
        });

        jsTestDriver.stdout.pipe(process.stdout);
        jsTestDriver.stderr.pipe(process.stderr);
    });
};
