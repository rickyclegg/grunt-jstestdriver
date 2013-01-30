# grunt-jstestdriver

Uniting testing using JS Test Driver.


## Getting Started
Navigate your console to your project folder and run command: `npm install grunt-jstestdriver`

This will download the plugin to your project folder. The terminal window may go a bit strange as it copies the jstestdriver.jar to a lib folder on your computer.
If you already have the jar file installed in ./lib/ then it will not download the file.

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-jstestdriver');
```

The gruntfile config options have three mandatory properties.

```javascript
jstestdriver: {
    browser: "/Applications/Firefox.app/Contents/MacOS/firefox",
    port: "9876",
    tests: "all"
}
```

In testing the plugin works a lot better if you specify your own config file.

Here is my sample config file for this plugin.

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
You can use pretty much all of the properties in the JSTD configuration.
https://code.google.com/p/js-test-driver/wiki/CommandLineFlags
In test verbose always breaks the when you run grunt as it throws warning from JsTestDriver which causes grunt to stop running.

Example grunt.js

```javascript
jstestdriver: {
    browser: "/Applications/Safari.app/Contents/MacOS/safari",
    port: "9876",
    preloadFiles: "true",
    tests: "all",
    basePath: "../../"
}
```

You must specify the full path to the browser on a Mac. As you can see in the example above this is a lot more than just: Applications/Safari

The server starts and stops after each grunt run. If you run into any problems and you need to reset the server, point to your jstestdriver.jar and call with the --reset option.
Or you can close down your terminal window.

```javascript
java -jar lib/jstestdriver.jar --reset
```

If you just want to test that the plugin is working. Install in its own project folder and navigate your Terminal to the folder and run: 'grunt'


## Contributing
Let me now if you experience any bugs. I have not spent long on this plugin, but there was definitely a whole where people are only testing on Webkit.


## Release History
* 2012/01/2 - v1.0.1 - Updated to Apache License.
* 2012/01/2 - v1.0.0 - First release version.


## License
Copyright (c) 2013 Ricky Clegg
Licensed under the Apache license.
