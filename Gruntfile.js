/*
 * grunt-jstestdriver
 * https://github.com/rickyclegg/grunt-jstestdriver
 *
 * Copyright (c) 2013 Ricky Clegg
 * Licensed under the MIT license.
 */
'use strict';
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'tasks/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        jstestdriver: {
            files: ["task-test/jsTestDriver_jstd.conf", "task-test/jsTestDriver_jas.conf"]
        }
    });

    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['jstestdriver', 'jshint']);
};
