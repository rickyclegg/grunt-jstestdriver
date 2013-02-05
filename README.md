# grunt-jstestdriver

Uniting testing using JS Test Driver.


## Getting Started
Navigate your console to your project folder and run command: `npm install grunt-jstestdriver`

This will download the plugin to your project folder.

If you already have the jar file installed in ./lib/ then it will not download the file.

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-jstestdriver');
```

A basic config of jstestdriver is as follows.

```javascript
jstestdriver: {
    start_and_run: {
        browser: "/Applications/Safari.app/Contents/MacOS/safari",
        port: "9876",
        preloadFiles: true,
        config: "task-test/jsTestDriver.conf",
        tests: "all"
    }
}
```

Then you can add the task to your gruntfile.

```javascript
grunt.registerTask('default', 'jstestdriver:start_and_run');
```

In testing the plugin works a lot better if you specify your own config file.

Here is my sample jstd config file for this plugin.

```
server: http://localhost:9876

basepath: ../

load:
    - task-test/lib/jasmine-1.3.1/lib/jasmine-1.3.1/jasmine.js
    - task-test/lib/jasmine-adapter/src/JasmineAdapter.js

test:
    - task-test/jstestdriver_jstd.js
    - task-test/jstestdriver_jasmine.js
```

[grunt]: http://gruntjs.com/
[getting_started]: https://github.com/gruntjs/grunt/blob/master/docs/getting_started.md


## Documentation
This plugin is a multitask for grunt. It has 2 task options. 'start_and_run' and 'run_tests'.
You can use pretty much all of the properties in the JSTD configuration.
https://code.google.com/p/js-test-driver/wiki/CommandLineFlags

In test verbose always breaks the when you run grunt as it throws warning from JsTestDriver which causes grunt to stop running.

Example grunt.js

```javascript
jstestdriver: {
    start_and_run: {
        browser: "/Applications/Safari.app/Contents/MacOS/safari"
    },
    run_tests: {},
    options: {
        port: "9876",
        preloadFiles: true,
        config: "task-test/jsTestDriver.conf",
        tests: "all"
    }
}
```

The options object is a way to specify defaults over both tasks. If you specify the same property in the sub-task it will overwrite the options object property.

You must specify the full path to the browser on a Mac. As you can see in the example above this is a lot more than just: Applications/Safari

### start\_and\_run

Start and run does a complete JS Test Driver run. It starts the server, opens the specified broswers, runs tests and stop the server and all processes.

This sub-task is really good for nightly builds.

In testing I have had trouble using this on a Mac. Safari has security options stopping Safari from opening and booting the browser connect page.

It also restricts you from testing on IE as it is harder to boot the browser. From feedback I know people are using this on windows without problems.

### run_tests

Run tests is a great if you are on a Mac or for your Grunt watch task.

You have to manually boot your server with the command below.

```
java -jar lib/jstestdriver.jar --config src-test/jsTestDriver.conf --port 9876 &
```

The '&' will allow you to keep writing more commands in the same terminal window.

Connect all your browsers you wish to test on. Open each one and navigate to: http://localhost:9876

Once you have connected you can use your 'run_tests' sub-task to keep running your tests on all browsers.
This allows Mac users to connect to IE and then run their tests across all browsers.

## Trouble shooting

If you run into any problems and you need to reset the server, point to your jstestdriver.jar and call with the --reset option.
Or you can close down your terminal window.

```javascript
java -jar lib/jstestdriver.jar --reset
```

If you just want to test that the plugin is working. Install in its own project folder and navigate your Terminal to the folder and run: 'grunt'


## Contributing
Let me now if you experience any bugs. I have not spent long on this plugin, but there was definitely a whole where people are only testing on Webkit.


## Release History
* 2012/04/2 - v1.1.4 - Updated docs, handles when error if you try to run a sub-task that does not exist.
* 2012/04/2 - v1.1.3 - Updated to remove the script for downloading jstestdriver.jar.
* 2012/04/2 - v1.1.0 - Re-written to have multitasks and simplify usage.
* 2012/01/2 - v1.0.2 - Bug fix. Grunt task not stopping if there are failing tests.
* 2012/01/2 - v1.0.1 - Updated to Apache License.
* 2012/01/2 - v1.0.0 - First release version.


## License
Copyright (c) 2013 Ricky Clegg
Licensed under the Apache license.