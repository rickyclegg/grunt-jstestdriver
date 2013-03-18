# grunt-jstestdriver

Uniting testing using JS Test Driver.

## Getting Started
Navigate your console to your project folder and run command:

```
npm install grunt-jstestdriver
```

This will download the plugin to your project folder.

Then add this line to your project's `Gruntfile.js':

```javascript
grunt.loadNpmTasks('grunt-jstestdriver');
```

A basic config of jstestdriver is as follows.

```javascript
jstestdriver: {
    files: ["src-test/unit/jsTestDriver.conf", "src-test/integration/jsTestDriver.conf"]
}
```

Then you can add the task to your gruntfile.

```javascript
grunt.registerTask('default', ['jstestdriver']);
```

Here is my sample jstd config file for this plugin.

```
server: http://localhost:9876

basepath: ../

load:
    - src-test/lib/jasmine-1.3.1/lib/jasmine-1.3.1/jasmine.js
    - src-test/lib/jasmine-adapter/src/JasmineAdapter.js

test:
    - src-test/jstestdriver_jstd.js
```

**Grunt Help**

[Grunt](http://gruntjs.com/)

[Getting started](http://gruntjs.com/getting-started)

## Documentation

####Example Gruntfile.js

```javascript
jstestdriver: {
    options: {
        canFail: true,
        verbose: true
    },
    files: ["task-test/jsTestDriver_jstd.conf", "task-test/jsTestDriver_jas.conf"
}
```

#### files - Array / String
The list of JSTD .conf files that you want to test.

#### options [optional] - Object
Extra options you want to pass to JSTD.

#### options.canFail [optional] - Boolean - Default = false
grunt-jstestdriver specific. If true tests are allowed to fail with stopping all tasks.

You can use most of the command file flags in the options object.
https://code.google.com/p/js-test-driver/wiki/CommandLineFlags

The ones that you cannot use are:

* browser
* config
* dryRunFor
* port
* server
* serverHandlerPrefix

### Starting the server

To run tests you must start your server. Navigate your command line to your project folder.

```
cd /User/Documents/MyApp
```

Then run the command below to start yourJSTD server.

```
java -jar lib/jstestdriver.jar --port 9876
```

You MUST leave the shell open to keep the server alive.

Open all the browsers you wish to connect, and navigate them to:

```
http://localhost:9876/capture
```

You are now ready to run the tests.

Open a new shell and navigate to your project again.

You can then run your grunt task.

## Trouble shooting

If you run into any problems and you need to reset the server, point to your jstestdriver.jar and call with the --reset option.
Or you can close down your terminal window.

```javascript
java -jar lib/jstestdriver.jar --reset
```

If you just want to test that the plugin is working.

## Contributing
Let me now if you experience any bugs. I have not spent long on this plugin, but there was definitely a whole where people are only testing on Webkit.


## Release History
* 2012/18/3 - v2.0.0 - Update to Grunt v0.4.
* 2012/13/2 - v1.3.0 - Updating to Grunt v0.4, base plugin.
* 2012/06/2 - v1.2.0 - Added ability to specify multiple configuration files.
* 2012/04/2 - v1.1.5 - Made start_and_run default if no task is specified.
* 2012/04/2 - v1.1.3 - Updated to remove the script for downloading jstestdriver.jar.
* 2012/04/2 - v1.1.0 - Re-written to have multitasks and simplify usage.
* 2012/01/2 - v1.0.2 - Bug fix. Grunt task not stopping if there are failing tests.
* 2012/01/2 - v1.0.1 - Updated to Apache License.
* 2012/01/2 - v1.0.0 - First release version.


## License
Copyright (c) 2013 Ricky Clegg
Licensed under the MIT license.