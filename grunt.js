module.exports = function (grunt) {
    "use strict";
    // Project configuration.
    grunt.initConfig({
        lint: {
            files: ['grunt.js', 'tasks/**/*.js']
        },
        watch: {
            files: '<config:lint.files>',
            tasks: 'default'
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                node: true,
                es5: true
            },
            globals: {}
        },
        jstestdriver: {
            browser: "/Applications/Firefox.app/Contents/MacOS/firefox",
            browserTimeout: null,
            captureConsole: null,
            config: "task-test/jsTestDriver.conf",
            dryRunFor: null,
            help: null,
            port: "9876",
            preloadFiles: true,
            requiredBrowsers: null,
            reset: null,
            server: null,
            serverHandlerPrefix: null,
            testOutput: null,
            tests: "all",
            plugins: null,
            basePath: null,
            runnerMode: null
        }
    });

    // Load local tasks.
    grunt.loadTasks('tasks');

    // Default task.
    grunt.registerTask('default', 'lint jstestdriver');

};
