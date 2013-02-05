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
            start_and_run: {
                browser: "/Applications/Firefox.app/Contents/MacOS/firefox",
            },
            run_tests: {},
            options: {
                port: "9876",
                preloadFiles: true,
                config: "task-test/jsTestDriver.conf",
                tests: "all"
            }
        },
        shell: {
            git_commit: {
                command: "git commit -a -m 'Committing from grunt'",
                stdout: true,
                failOnError: true
            }
        }
    });

    // Load local tasks.
    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-shell');

    // Default task.
    grunt.registerTask('default', 'lint jstestdriver:start_and_run');

};
